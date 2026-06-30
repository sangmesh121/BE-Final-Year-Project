import requests

# Wikimedia source (Parle-G)
url = "https://upload.wikimedia.org/wikipedia/commons/f/f6/Parle-G_Biscuits_%28India%29.jpg"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

try:
    print(f"Downloading from {url}...")
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        with open("parle_test.jpg", "wb") as f:
            f.write(response.content)
        print("Download successful: parle_test.jpg")
    else:
        print(f"Failed to download: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
