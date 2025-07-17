import { useState, useRef, useEffect, use } from "react";
import { useAppContext } from "../context/AppContext";

type Message = {
  role: "user" | "ai";
  content: string;
};

const Chat: React.FC<{
  onSend: (message: string, file?: File) => Promise<string>;
}> = ({ onSend }) => {
  const { hasDocs, initialLoading } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage: Message = {
      role: "user",
      content: input + (file ? ` (📎 ${file.name})` : ""),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
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

  useEffect(() => {
    if (!hasDocs) {
      setMessages([]);
    }
  }, [hasDocs]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
      <div className="flex items-center mb-2">
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            hasDocs ? "bg-green-400 animate-ping opacity-75" : "bg-gray-400"
          }`}
          title={`Agent status: ${status}`}
        />
        <span className="text-sm text-gray-700">
          Agent:{" "}
          {initialLoading
            ? "fetching agent status"
            : hasDocs
            ? "Ask me about your files!"
            : "Not ready yet"}
        </span>
      </div>
      <div
        className={`flex-1 overflow-y-auto border rounded-lg p-4 bg-white shadow-sm transition-opacity scroll-smooth ${
          !hasDocs ? "opacity-50 pointer-events-none" : ""
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
        {!hasDocs && (
          <div className="flex items-center justify-center">
            <div className="bg-white/80 text-center px-4 py-4 rounded shadow text-black text-sm">
              To use the chat function, please first upload a file to agent's
              storage.
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
          placeholder={
            !hasDocs
              ? "You must upload a file before chating"
              : "Ask something..."
          }
          disabled={!hasDocs}
        />

        <button
          onClick={handleSend}
          disabled={!hasDocs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
