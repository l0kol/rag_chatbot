import axios from "axios";

const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8000";

/**
 * API functions to interact with the RAG agent backend.
 */

// POST FUNCTIONS

export const handleQuestion = async (
  question: string,
  userId: string
): Promise<string> => {
  try {
    const response = await axios.post(`${AGENT_API_URL}/agent/ask`, {
      question,
      user_id: userId,
    });

    return response.data.answer;
  } catch (error) {
    console.error("Error calling agent:", error);
    throw new Error("Failed to get response from agent");
  }
};

export const uploadFileToAgentVS = async (
  files: Express.Multer.File[],
  userId: string
): Promise<string> => {
  const formData = new FormData();

  for (const file of files) {
    const typedArray = new Uint8Array(file.buffer);
    const blob = new Blob([typedArray], { type: file.mimetype });

    formData.append("files", blob, file.originalname);
  }

  formData.append("user_id", userId);

  console.log(
    "Uploading files:",
    files.map((f) => f.originalname)
  );

  try {
    const response = await axios.post(
      `${AGENT_API_URL}/agent/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

// DELETE FUNCTIONS

export const deleteUserChromaCollection = async (
  userId: string
): Promise<string> => {
  try {
    const response = await axios.delete(`${AGENT_API_URL}/agent/delete_docs`, {
      params: { user_id: userId },
    });
    return response.data.message;
  } catch (error) {
    console.error("Error deleting user documents:", error);
    throw new Error("Failed to delete user documents");
  }
};

// GETTER FUNCTIONS

export const getAgentDBStatus = async (userId: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${AGENT_API_URL}/agent/status?user_id=${userId}`
    );
    return response.data.status;
  } catch (error) {
    console.error("Error getting agent status:", error);
    throw new Error("Failed to get agent status");
  }
};

export const getUserDocsFromDB = async (userId: string): Promise<string[]> => {
  try {
    const response = await axios.get(
      `${AGENT_API_URL}/agent/user_docs?user_id=${userId}`
    );
    return response.data.docs;
  } catch (error) {
    console.error("Error getting user documents:", error);
    throw new Error("Failed to get user documents");
  }
};
