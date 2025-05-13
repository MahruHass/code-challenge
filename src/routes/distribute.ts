import express from "express";
import multer from "multer";
import { distributeVideo } from "../controllers/videoController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/distribute", upload.single("video"), distributeVideo);

export default router;
