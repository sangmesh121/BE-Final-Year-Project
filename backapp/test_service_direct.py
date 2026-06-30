import sys
import os

# Add the current directory to sys.path so we can import services
sys.path.append(os.getcwd())

from services.gemini_service import gemini_service

def test_service():
    image_path = "parle_test.jpg"
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    print(f"Testing GeminiService with {image_path}...")
    key = gemini_service.api_key
    print(f"Loaded API Key: {key[:5]}...{key[-5:] if key else ''}")
    
    with open(image_path, "rb") as f:
        image_data = f.read()

    try:
        result = gemini_service.verify_product_authenticity(image_data)
        import json
        with open("test_output.json", "w") as f:
            json.dump(result, f, indent=2)
        print("Test complete. Output saved to test_output.json")
    except Exception as e:
        print(f"Service Call Failed: {e}")

if __name__ == "__main__":
    test_service()
