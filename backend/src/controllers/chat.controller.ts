import { Request, Response } from "express";
import {
  handleQuestion,
  uploadFileToAgentFAISS,
  getAgentDBStatus,
} from "../services/chat.services";

export const askQuestionWithFile = async (req: Request, res: Response) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  try {
    console.log("Received question:", question);

    const answer = await handleQuestion(question);
    res.json({ answer });
  } catch (err) {
    console.error("askQuestionWithFile error:", err);
    res.status(500).json({ error: "Failed to handle question" });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "File is required" });
  }

  try {
    const file = req.file;
    console.log("Received file:", req.file.originalname);

    const result = await uploadFileToAgentFAISS(file);
    res.json({ message: result });
  } catch (err) {
    console.error("uploadFile error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const getAgentStatus = async (req: Request, res: Response) => {
  try {
    const status = await getAgentDBStatus();
    console.log("Agent status:", status);
    res.json({ status });
  } catch (err) {
    console.error("getAgentStatus error:", err);
    res.status(500).json({ error: "Failed to get agent status" });
  }
};
