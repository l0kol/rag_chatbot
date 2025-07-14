import React, { useState, useRef, useEffect } from "react";
import { getAgentStatus } from "../api/AgentApi";

type Message = {
  role: "user" | "ai";
  content: string;
};

const Chat: React.FC<{
  onSend: (message: string, file?: File) => Promise<string>;
}> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getAgentStatus();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching agent status:", error);
        setStatus("Error fetching status");
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    console.log("Agent status:", status);
  }, [status]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    console.log("Sending message:", input, file);

    const userMessage: Message = {
      role: "user",
      content: input + (file ? ` (📎 ${file.name})` : ""),
    };

    console.log("User message:", userMessage);

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      console.log("Calling onSend with input:", input, "and file:", file);
      const aiReply = await onSend(input, file ?? undefined);
      setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error retrieving answer." },
      ]);
    }

    setInput("");
    setFile(null);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
      <div className="flex items-center mb-2">
        <div
          className={`h-3 w-3 rounded-full mr-2 ${
            status === "Ready" ? "bg-green-500" : "bg-gray-400"
          }`}
          title={`Agent status: ${status}`}
        />
        <span className="text-sm text-gray-700">
          Agent:{" "}
          {status === "ready" ? "Ready" : status ?? "Please upload files first"}
        </span>
      </div>
      {/* Message container */}
      <div
        className={`flex-1 overflow-y-auto border rounded-lg p-4 bg-white shadow-sm transition-opacity scroll-smooth ${
          status !== "Ready" ? "opacity-50 pointer-events-none" : ""
        }`}
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">Thinking...</div>}
        <div ref={bottomRef} />
        {status !== "Ready" && (
          <div className="flex items-center justify-center">
            <div className="bg-white/80 text-center px-4 py-3 rounded shadow text-gray-800 text-sm">
              The agent is not ready. Please upload a file using the button on
              the right to activate it.
            </div>
          </div>
        )}
      </div>
      <div className="flex mt-4 gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask something..."
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
