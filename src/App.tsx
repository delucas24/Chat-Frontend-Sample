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
        "https://203e-114-4-213-24.ngrok-free.app/api/domain-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // Required for ngrok
            "Authorization": "Bearer your_token_if_needed" // Optional auth
          },
          body: JSON.stringify({
            user_input: input,
            session_id: `react-session-${Date.now()}`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: input, sender: "user" },
        { text: data.response, sender: "bot" },
      ]);

      setInput("");
    } catch (err) {
      setError(
        `Gagal mengirim pesan: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Chatbot with FastAPI
      </h1>

      {/* Chat Container */}
      <div className="h-96 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto flex flex-col bg-white shadow-sm">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center my-auto">
            Mulai percakapan...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-2 mb-3 rounded-2xl ${
                msg.sender === "user"
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        {loading && (
          <div className="self-start bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
            Loading...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 mb-3 p-2 bg-red-50 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 sticky bottom-6 bg-white p-2 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          disabled={loading}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengirim...
            </span>
          ) : (
            "Kirim"
          )}
        </button>
      </form>

      {/* Debug Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Backend: 203e-114-4-213-24.ngrok-free.app</p>
        <p>Status: {loading ? "Connecting..." : "Ready"}</p>
      </div>
    </div>
  );
};

export default App;
