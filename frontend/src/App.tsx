import { useState } from "react";
import axios from "axios";
import "./App.css";

type ChatMessage = {
  role: "user" | "agent";
  content: string;
};

function App() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");

    // Add user's message
    setChat((prev) => [...prev, { role: "user", content: question }]);

    try {

      const formattedHistory = chat
      .slice(4) // last 2 user + 2 agent messages
      .filter((msg) => msg.role === "user" || msg.role === "agent")
      .map((msg) =>
        msg.role === "user" ? `Q: ${msg.content}` : `SQL: ${msg.content.split("\n")[0].includes("SQL") ? msg.content.split("\n")[0] : msg.content}`
      );

      const res = await axios.post("http://localhost:8000/query", {
        question,
        history: formattedHistory,
      });

      const { sql, results, error } = res.data;

      if (error) {
        setChat((prev) => [
          ...prev,
          { role: "agent", content: `❌ Error: ${error}` },
        ]);
      } else {
        const resultPreview = results && results.length > 0
          ? (results as Record<string, any>[])
              .map((r) => Object.values(r).join(" | "))
              .join("\n")
          : "(No results)";


        const responseMessage = `📊 Results:\n${resultPreview}\n____________\n\n 🧠 SQL query:\n${sql}`;

        setChat((prev) => [...prev, { role: "agent", content: responseMessage }]);
      }
    } catch (err: any) {
      setChat((prev) => [
        ...prev,
        { role: "agent", content: `❌ Network error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>💬 SQL Chat Agent</h1>

      <div style={{ marginBottom: "2rem" }}>
      {chat.map((msg, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              background: msg.role === "user" ? "#d1e7dd" : "#f0f0f0",
              color: "#000",
              padding: "0.75rem 1rem",
              borderRadius: "1rem",
              maxWidth: "70%",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}

      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the database..."
          style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
        />
        <button onClick={askQuestion} disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}
    </div>
  );
}

export default App;
