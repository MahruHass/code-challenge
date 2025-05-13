import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { log, error } from '../utils/logger';

type ServiceResponse = {
    service: string;
    status: 'success' | 'error';
    responseTime: number;
    response?: any;
    error?: string;
};

const services = [
    { name: 'service-1', url: 'https://api.postclips.com/api/code-challenge/service-1' },
    { name: 'service-2', url: 'https://api.postclips.com/api/code-challenge/service-2' },
    { name: 'service-3', url: 'https://api.postclips.com/api/code-challenge/service-3' }
];
log('Service distribution module initialized');

export async function distributeToServices(videoPath: string, campaignId: string): Promise<ServiceResponse[]> {
    const formData = (videoPath: string, campaignId: string) => {
        const form = new FormData();
        form.append('video', fs.createReadStream(videoPath));
        form.append('campaignId', campaignId);
        return form;
    };

    const requests = services.map(({ name, url }) => {
        const start = Date.now();
        log(`Starting request to ${name} at ${url}`);

        return axios.post(url, formData(videoPath, campaignId), {
            headers: formData(videoPath, campaignId).getHeaders(),
            timeout: 60000 // 60 seconds
        }).then((res): ServiceResponse => {
            const responseTime = Date.now() - start;

            return {
                service: name,
                status: 'success',
                responseTime,
                response: res.data
            };
        }).catch((err): ServiceResponse => {
            const responseTime = Date.now() - start;

            error(`Service ${name} error: Response time ${responseTime}ms, Error: ${err.message || 'Unknown error'}`);

            return {
                service: name,
                status: 'error',
                responseTime,
                error: err.message || 'Unknown error'
            };
        });
    });

    return Promise.all(requests);
}