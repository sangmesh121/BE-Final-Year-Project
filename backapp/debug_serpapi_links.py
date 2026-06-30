
import os
from dotenv import load_dotenv
from serpapi import GoogleSearch
import json

load_dotenv()
api_key = os.getenv("SEARCH_API_KEY")

def debug_serpapi_links():
    print("Debugging SerpApi Google Shopping Links...")
    params = {
        "engine": "google_shopping",
        "q": "Maggi Noodles",
        "api_key": api_key,
        "google_domain": "google.co.in",
        "gl": "in",
        "hl": "en",
        "num": 5
    }
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        shopping_results = results.get("shopping_results", [])
        
        if not shopping_results:
            print("No shopping results found.")
            return

        if shopping_results:
             with open("keys.txt", "w", encoding="utf-8") as f:
                 f.write("KEYS:\n")
                 for k in shopping_results[0].keys():
                     f.write(f"{k}\n")
                 f.write("-" * 20 + "\n")
                 f.write("LINK VALUES:\n")
                 for k, v in shopping_results[0].items():
                     if "link" in k or "url" in k:
                         f.write(f"{k}: {v}\n")
             return
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_serpapi_links()
