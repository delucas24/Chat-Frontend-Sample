import React, { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://192.168.190.100:3000/api/domain-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: input,
            session_id: `react-session-${Date.now()}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: input, sender: "user" },
        { text: data.response, sender: "bot" },
      ]);

      setInput("");
    } catch (err) {
      setError((err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 font-sans">
      <h1 className="text-xl font-bold mb-4 text-center">
        Chatbot dengan FastAPI
      </h1>

      <div className="h-96 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] px-4 py-2 mb-2 rounded-xl ${
              msg.sender === "user"
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-xl">
            Loading...
          </div>
        )}
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          disabled={loading}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </div>
  );
};

export default App;
