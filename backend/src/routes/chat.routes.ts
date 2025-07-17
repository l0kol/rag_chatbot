import express from "express";
import multer from "multer";
import {
  askQuestionWithFile,
  uploadFile,
  getAgentStatus,
  getUserDocs,
  deleteUserDocs,
} from "../controllers/chat.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/ask", askQuestionWithFile);
router.post("/upload", upload.array("files"), uploadFile);
router.get("/status", getAgentStatus);
router.get("/user_docs", getUserDocs);
router.delete("/delete_docs", deleteUserDocs);

export default router;
