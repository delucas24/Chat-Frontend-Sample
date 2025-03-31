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
        "https://7c08-114-4-213-10.ngrok-free.app/api/domain-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true" // Tetap diperlukan untuk ngrok
          },
          body: JSON.stringify({
            user_input: input
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: input, sender: "user" },
        { text: data.response, sender: "bot" },
      ]);

      setInput("");
    } catch (err) {
      setError("Gagal mengirim pesan. Coba lagi nanti.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat App</h1>
      
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Loading...</div>}
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

// CSS (simpan di file terpisah atau tambahkan di sini)
const styles = `
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial;
  }
  
  .messages {
    height: 400px;
    border: 1px solid #ddd;
    padding: 10px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .message {
    max-width: 70%;
    padding: 8px 12px;
    margin-bottom: 8px;
    border-radius: 4px;
  }
  
  .user {
    background: #007bff;
    color: white;
    margin-left: auto;
  }
  
  .bot {
    background: #f1f1f1;
    margin-right: auto;
  }
  
  .error {
    color: red;
    margin: 10px 0;
  }
  
  form {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 8px;
  }
  
  button {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
  }
`;

// Tambahkan CSS ke dokumen
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
