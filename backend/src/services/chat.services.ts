import axios from "axios";

export const handleQuestion = async (question: string): Promise<string> => {
  // For now, just send question
  try {
    const response = await axios.post("http://localhost:8000/agent/ask", {
      question,
    });

    return response.data.answer;
  } catch (error) {
    console.error("Error calling agent:", error);
    throw new Error("Failed to get response from agent");
  }
};

export const uploadFileToAgentFAISS = async (
  file: Express.Multer.File
): Promise<string> => {
  const formData = new FormData();

  // Create a Uint8Array from the Buffer to ensure it's compatible
  const typedArray = new Uint8Array(file.buffer);

  // This is now a valid BlobPart
  const blob = new Blob([typedArray], { type: file.mimetype });

  formData.append("file", blob, file.originalname);

  try {
    const response = await axios.post(
      "http://localhost:8000/agent/upload",
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

export const getAgentDBStatus = async (): Promise<string> => {
  try {
    const response = await axios.get("http://localhost:8000/agent/status");
    return response.data.status;
  } catch (error) {
    console.error("Error getting agent status:", error);
    throw new Error("Failed to get agent status");
  }
};
