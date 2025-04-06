from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import sqlparse

def load_model(model_name="tscholak/1zha5ono"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return tokenizer, model

# Build the prompt for the model (simple format)
def build_prompt(question, db_id, schema, history: list[str] = None) -> str:
    schema_lines = []
    for line in schema.strip().split("\n"):
        line = line.strip()
        if not line or ":" not in line:
            continue  # skip empty or malformed lines
        table_name, columns = line.split(":", 1)
        schema_lines.append(f"{table_name.strip()} : {columns.strip()}")

    formatted_schema = " | ".join(schema_lines)
    prompt = ""

    if history:
        for entry in history:
            prompt += f"{entry.strip()}\n"

    prompt += f"Q: {question}\n"
    input_text = f"{prompt} | {db_id} | {formatted_schema}"
    return input_text

# Generate SQL from natural language question
def generate_sql(tokenizer, model, input_text) -> str:
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512)
    outputs = model.generate(**inputs, max_length=256)
    sql = tokenizer.decode(outputs[0], skip_special_tokens=True)
    sql = sql.split("|", 1)[1].strip()  # remove db_id
    sql = clean_sql(sql)
    return sql

# Clean the generated SQL query
def clean_sql(sql) -> str:
    formatted = sqlparse.format(sql, keyword_case='upper', identifier_case='lower', strip_comments=True, reindent=True)
    formatted = formatted.replace('"', "'").rstrip(";")
    return formatted

    