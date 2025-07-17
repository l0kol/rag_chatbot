import { getOrCreateUserId } from "../utils/user";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001/api";

console.log("Backend URL:", import.meta.env.VITE_BACKEND_API_URL);

/**
 * API functions to interact with the agent backend.
 * These functions handle asking questions, uploading files, checking status,
 * and managing user documents.
 */

export async function askAgent(question: string): Promise<string> {
  const userId = getOrCreateUserId();
  const response = await fetch(`${BACKEND_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from server");
  }

  const data = await response.json();

  return data.answer;
}
export async function uploadFileToAgent(files: File[]): Promise<string> {
  const userId = getOrCreateUserId();

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  formData.append("user_id", userId);

  const response = await fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const result = await response.json();
  return result.message;
}

export async function getAgentStatus(): Promise<string> {
  const userId = getOrCreateUserId();

  const response = await fetch(`${BACKEND_URL}/status?user_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get agent status");
  }

  const data = await response.json();
  return data.status;
}

export async function getUserDocs(): Promise<string[]> {
  const userId = getOrCreateUserId();

  const response = await fetch(`${BACKEND_URL}/user_docs?user_id=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user documents");
  }

  const data = await response.json();
  return data.docs || [];
}

export async function deleteUserDocs(): Promise<string> {
  const userId = getOrCreateUserId();

  const response = await fetch(`${BACKEND_URL}/delete_docs?user_id=${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user documents");
  }

  const data = await response.json();
  return data.message || "Documents deleted successfully";
}
