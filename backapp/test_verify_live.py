import requests
import json

url = "http://127.0.0.1:8000/verify"
files = {'file': ('parle_test.jpg', open('parle_test.jpg', 'rb'), 'image/jpeg')}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error Response:")
        print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
