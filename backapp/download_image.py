import requests
import os

url = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Parle-G_Biscuit.jpg"
output_path = "parle_g_test.jpg"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print(f"Downloading from {url}...")
try:
    response = requests.get(url, headers=headers, stream=True)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            
    print(f"Download successful: {output_path}")
    print(f"File size: {os.path.getsize(output_path)} bytes")
except Exception as e:
    print(f"Error downloading: {e}")
