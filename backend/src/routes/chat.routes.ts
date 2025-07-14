import express from "express";
import multer from "multer";
import {
  askQuestionWithFile,
  uploadFile,
} from "../controllers/chat.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/ask", askQuestionWithFile);
router.post("/upload", upload.single("file"), uploadFile);

export default router;
