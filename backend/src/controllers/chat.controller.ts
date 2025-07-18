import { Request, Response } from "express";
import {
  handleQuestion,
  uploadFileToAgentVS,
  getAgentDBStatus,
  getUserDocsFromDB,
  deleteUserChromaCollection,
} from "../services/chat.services";

/**
 * Controller functions for handling chat-related requests.
 * These functions handle asking questions, uploading files,
 * checking agent status, and managing user documents.
 */

export const askQuestionWithFile = async (req: Request, res: Response) => {
  const question = req.body.question;
  const userId = req.body.user_id;

  if (!question || !userId) {
    return res.status(400).json({ error: "Question and user_id are required" });
  }

  try {
    const answer = await handleQuestion(question, userId);
    res.json({ answer });
  } catch (err) {
    console.error("askQuestionWithFile error:", err);
    res.status(500).json({ error: "Failed to handle question" });
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  const userId = req.body.user_id;
  const files = req.files as Express.Multer.File[];
  if (!files || !userId) {
    return res.status(400).json({ error: "File and user_id are required" });
  }

  try {
    const result = await uploadFileToAgentVS(files, userId);
    res.json({ message: result });
  } catch (err) {
    console.error("uploadFile error:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

export const getAgentStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const status = await getAgentDBStatus(userId);
    console.log("Agent status:", status);
    res.json({ status });
  } catch (err) {
    console.error("getAgentStatus error:", err);
    res.status(500).json({ error: "Failed to get agent status" });
  }
};

export const getUserDocs = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const docs = await getUserDocsFromDB(userId);
    res.json({ docs });
  } catch (err) {
    console.error("getUserDocs error:", err);
    res.status(500).json({ error: "Failed to get user documents" });
  }
};

export const deleteUserDocs = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const result = await deleteUserChromaCollection(userId);

    res.json({ message: "User documents deleted successfully" });
  } catch (err) {
    console.error("deleteUserDocs error:", err);
    res.status(500).json({ error: "Failed to delete user documents" });
  }
};
