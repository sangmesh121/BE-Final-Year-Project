import requests
import io
from PIL import Image

# Create a dummy image (red square)
img = Image.new('RGB', (100, 100), color = 'red')
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='JPEG')
img_byte_arr = img_byte_arr.getvalue()

files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}

print("--- Testing /price Endpoint ---")
try:
    response = requests.post("http://127.0.0.1:8000/price", files=files, timeout=30)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Product Name: {data.get('product_name')}")
        print(f"Prices Found: {len(data.get('prices', []))}")
        if data.get('prices'):
            print(f"Sample Price: {data['prices'][0]}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Price Test Failed: {e}")

# Reset file pointer for next request
files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}

print("\n--- Testing /verify Endpoint ---")
try:
    response = requests.post("http://127.0.0.1:8000/verify", files=files, timeout=30)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Verdict: {data.get('verification_result', {}).get('verdict')}")
        print(f"Match Score: {data.get('verification_result', {}).get('match_score')}")
        print(f"Conf. Score: {data.get('verification_result', {}).get('confidence_score')}")
        print(f"Gemini Analysis: {data.get('verification_result', {}).get('gemini_analysis')}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Verify Test Failed: {e}")
