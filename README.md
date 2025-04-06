# 💬 Text-to-SQL with LLMs  
A conversational agent that lets you query a relational database using natural language. Built with a fine-tuned LLM for text-to-SQL, this tool generates SQL queries from questions, executes them against a real database, and returns results in a clean, chat-like interface.
![Demo Screenshot](https://github.com/user-attachments/assets/d2182a89-5dfb-4d30-90e7-0c0d81304b73)

---

## ⚙️ How It Works

1. 🧑 The user asks a question in natural language.  
2. 💬 The frontend sends the question — along with chat history — to the backend.  
3. 🚀 The FastAPI backend:
   - Builds a **few-shot prompt** using recent Q&A turns
   - Uses a fine-tuned **T5 model** (e.g. `tscholak/1zha5ono`) to generate SQL
   - Executes the SQL on a **Chinook SQLite** database  
4. 📊 Results and the generated SQL are returned and rendered in a **conversational UI**.

---

## 🛠️ How to Run It

Clone the repo and open **two terminals**:

### Terminal 1: Frontend

```bash
cd frontend
npm install    # Only needed the first time
npm start
```
Runs at: [http://localhost:3000](http://localhost:3000)

### Terminal 2: Backend

```bash
cd api
uvicorn main:app --reload
```
Runs at: [http://localhost:8000](http://localhost:8000)

> ✅ Make sure `data/Chinook_Sqlite.sqlite` is present in the root directory.

---

## 🔮 Future Improvements

This project is functional, but still early-stage. Known limitations and opportunities for improvement include:

- ❌ **No evaluation metrics yet**: There's no benchmarking on accuracy, relevance, or SQL correctness.
- 🤔 **Conversational logic is shallow**: Even when passing Q&A history into the prompt, follow-up questions can fail to resolve ambiguity or context correctly.

  **Example:**
  - Q: *"How many employees are there?"*  
  - Q: *"What are their names?"*  
  - 🧠 The agent incorrectly returns customer names instead of employee names.

- 🧠 Potential improvements:
  - Better schema-aware context understanding
  - Fine-tuning on multi-turn Spider/WikiSQL-like datasets
  - Real-time SQL edit + re-execution
  - Token-aware history trimming to prevent LLM cutoff
  - Natural language explanation of results




