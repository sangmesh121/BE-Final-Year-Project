
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

models = []
for m in genai.list_models():
    models.append(m.name)

with open("models.json", "w") as f:
    json.dump(models, f, indent=2)

print(f"Saved {len(models)} models to models.json")
