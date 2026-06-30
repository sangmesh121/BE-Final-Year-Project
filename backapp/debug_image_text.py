
import sys
import os
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import time

# Output utf-8
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Using Gemini 3 Pro as requested
model = genai.GenerativeModel('gemini-3-pro-preview')

img_path = r"C:\Users\sangm\Downloads\246d6da6-e8e9-491d-8fb8-700ba0ad8bd6.png"

if not os.path.exists(img_path):
    print("Image not found")
    sys.exit(1)

print(f"Analyzing: {os.path.basename(img_path)}")
print("-" * 30)

try:
    img = Image.open(img_path)
    prompt = """
    Look at the brand name text. focus on the LAST letter.
    1. Describe the shape of the last letter in detail. 
       - Does it curve up at the bottom like a hook?
       - Does it have a horizontal bar pointing inward like a standard 'G'?
       - Is it a 'J' or a 'G'?
    
    2. Transcription: Write the brand name based on this shape analysis.
    """
    
    retries = 3
    for attempt in range(retries):
        try:
            print(f"Attempt {attempt+1} with gemini-3-pro-preview...")
            response = model.generate_content([prompt, img])
            print(response.text)
            break
        except Exception as e:
            if "429" in str(e):
                print("Rate limit hit. Waiting 45 seconds...")
                time.sleep(45)
            else:
                print(f"Error: {e}")
                break

except Exception as e:
    print(f"Fatal Error: {e}")
