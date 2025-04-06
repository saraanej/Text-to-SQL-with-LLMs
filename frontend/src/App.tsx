import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [sql, setSql] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/query", {
        question,
      });
      setSql(res.data.sql || "");
      setResults(res.data.results || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem" }}>
      <h1>Text-to-SQL Agent</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button onClick={askQuestion} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Asking..." : "Ask"}
      </button>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {sql && (
        <>
          <h3>🧠 SQL</h3>
          <pre>{sql}</pre>
        </>
      )}

      {results.length > 0 && (
        <>
          <h3>📊 Results</h3>
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                {Object.keys(results[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
