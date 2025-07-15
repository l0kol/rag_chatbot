import { useEffect, useState } from "react";
import { uploadFileToAgent, getUserDocs } from "../api/AgentApi";

const FileUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get user docs
    const fetchUserDocs = async () => {
      try {
        const docs = await getUserDocs();
        console.log("Fetched user docs:", docs);
        setUploadedFiles(docs);
      } catch (err: any) {
        console.error("Failed to fetch user docs:", err);
        setMessage("Failed to load uploaded files.");
      }
    };
    fetchUserDocs();
  }, []);

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
      <p className="text-xs text-gray-500 mb-2">
        You can add multiple files by uploading them one after another.
      </p>
      <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {!loading && <p className="text-sm text-white-500">Choose File(s)</p>}
        {loading && (
          <span className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span> Loading</span>
          </span>
        )}
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {message && <p className="text-sm text-green-600">{message}</p>}

      <div className="mt-4">
        <hr className="my-2 border-gray-300" />
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
