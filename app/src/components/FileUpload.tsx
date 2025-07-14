import React, { useState } from "react";
import { uploadFileToAgent } from "../api/AgentApi";

const FileUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");
    try {
      const result = await uploadFileToAgent(file);
      setUploadedFiles((prev) => [...prev, file.name]);
      setMessage(result);
    } catch (err: any) {
      setMessage(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upload Documents</h2>
      <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        Choose File
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-1">Uploaded Files</h3>
        <ul className="text-sm list-disc list-inside text-gray-700">
          {uploadedFiles.map((filename, i) => (
            <li key={i}>{filename}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
