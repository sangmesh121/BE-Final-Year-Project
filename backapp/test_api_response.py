import requests
import os

# Use the generated Parle-J image
image_path = "parle_test.jpg"

if not os.path.exists(image_path):
    print(f"Error: {image_path} not found. Please ensure it exists.")
    exit(1)

url = "http://127.0.0.1:8000/verify"
files = {'file': (image_path, open(image_path, 'rb'), 'image/jpeg')}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, files=files)
    if response.status_code == 200:
        data = response.json()
        print("\n✅ API Response Received:")
        
        # Check for raw_forensic_analysis
        if "raw_forensic_analysis" in data:
            print("   [PASS] 'raw_forensic_analysis' field PRESENT.")
            flags = data["raw_forensic_analysis"].get("forensic_flags", [])
            print(f"   [INFO] Found {len(flags)} forensic flags.")
            for flag in flags:
                 print(f"      - {flag.get('check')}: {flag.get('status')}")
        else:
            print("   [FAIL] 'raw_forensic_analysis' field MISSING.")
            
    else:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Connection Error: {e}")
