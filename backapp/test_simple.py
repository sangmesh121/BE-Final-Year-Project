from dotenv import load_dotenv
load_dotenv()

import requests
import os

# Single test image
# Single test image
img_path = "test.jpg"

if not os.path.exists(img_path):
    print(f"Image not found: {img_path}")
    exit(1)

url = "http://localhost:8000/verify"

print("Testing CoT Verification Endpoint")
print(f"Image: {os.path.basename(img_path)}\n")

with open(img_path, "rb") as f:
    files = {"file": (os.path.basename(img_path), f, "image/png")}
    response = requests.post(url, files=files, timeout=90)

print(f"Status: {response.status_code}\n")

if response.status_code == 200:
    import json
    data = response.json()
    print(json.dumps(data, indent=2))
else:
    print(f"Error: {response.text}")
