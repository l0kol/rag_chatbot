import { getOrCreateUserId } from "../utils/user";

export async function askAgent(question: string): Promise<string> {
  const userId = getOrCreateUserId();
  const response = await fetch("http://localhost:3001/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ← This makes req.body work
    },
    body: JSON.stringify({ question, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from server");
  }

  const data = await response.json();

  return data.answer;
}
export async function uploadFileToAgent(file: File): Promise<string> {
  const userId = getOrCreateUserId();

  const formData = new FormData();
  console.log("Uploading file:", file.name);
  formData.append("file", file);
  formData.append("user_id", userId);

  const response = await fetch("http://localhost:3001/api/upload", {
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

  const response = await fetch(
    `http://localhost:3001/api/status?user_id=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get agent status");
  }

  const data = await response.json();
  return data.status;
}

export async function getUserDocs(): Promise<string[]> {
  const userId = getOrCreateUserId();

  const response = await fetch(
    `http://localhost:3001/api/user_docs?user_id=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get user documents");
  }

  const data = await response.json();
  return data.docs || [];
}
