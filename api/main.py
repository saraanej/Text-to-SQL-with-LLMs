from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from text_to_sql import load_model, build_prompt, generate_sql
from sql_runner import run_query, chinook_schema, db_path

app = FastAPI()

# Allow CORS from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model once
tokenizer, model = load_model()

class QueryRequest(BaseModel):
    question: str

@app.post("/query")
def handle_query(req: QueryRequest):
    try:
        prompt = build_prompt(req.question, "chinook", chinook_schema)
        sql = generate_sql(tokenizer, model, prompt)
        df = run_query(db_path, sql)
        result = df.to_dict(orient="records") if df is not None else []
        return {"sql": sql, "results": result}
    except Exception as e:
        return {"error": str(e)}
