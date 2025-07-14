export async function askAgent(question: string): Promise<string> {
  const response = await fetch("http://localhost:3001/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // ← This makes req.body work
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from server");
  }

  const data = await response.json();
  return data.answer;
}
export async function uploadFileToAgent(file: File): Promise<string> {
  const formData = new FormData();
  console.log("Uploading file:", file.name);
  formData.append("file", file);

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
