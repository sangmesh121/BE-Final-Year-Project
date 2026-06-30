from dotenv import load_dotenv
load_dotenv()

import requests
import json

# Test the /price endpoint
url = "http://localhost:8000/price"

# Read a test image (you might need to create a simple test image)
try:
    with open("test_image.jpg", "rb") as f:
        files = {"file": f}
        response = requests.post(url, files=files)
        print("Status Code:", response.status_code)
        print("\nResponse JSON:")
        print(json.dumps(response.json(), indent=2))
        
        # Check the prices array
        data = response.json()
        if "prices" in data:
            print(f"\n\nFound {len(data['prices'])} prices")
            for i, price in enumerate(data["prices"]):
                link = price.get("link", "")
                print(f"[{i}] Seller: {price.get('seller')} | Link: {'[YES]' if link else '[NO]'} {link[:50] if link else ''}")
except FileNotFoundError:
    print("test_image.jpg not found. Please create a test image first.")
except Exception as e:
    print(f"Error: {e}")
