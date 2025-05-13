import { Request, Response } from "express";
import { distributeToServices } from "../services/videoDispatcher";

export const distributeVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const video = req.file;
  const campaignId = req.body.campaignId;

  if (!video || !campaignId) {
    res.status(400).json({ error: "video and campaignId are required" });
    return;
  }

  try {
    const results = await distributeToServices(video.path, campaignId);

    const hasSuccess = results.some((r) => r.status === "success");
    const hasFailure = results.some((r) => r.status === "error");

    const overallStatus =
      hasSuccess && hasFailure
        ? "partialSuccess"
        : hasSuccess
        ? "success"
        : "failure";

    res.json({
      timestamp: new Date().toISOString(),
      overallStatus,
      services: results,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};
