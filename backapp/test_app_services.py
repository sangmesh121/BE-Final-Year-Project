import requests
import argparse
import os
import time

API_BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(endpoint_name, url, image_path):
    print(f"\n{'='*50}")
    print(f"Testing Endpoint: {endpoint_name} -> {url}")
    print(f"{'='*50}")
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    try:
        with open(image_path, 'rb') as f:
            files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
            
            start_time = time.time()
            print(f"Sending request to {url}...")
            response = requests.post(url, files=files, timeout=60)
            elapsed_time = time.time() - start_time
            
            print(f"Response Status: {response.status_code} (took {elapsed_time:.2f}s)")
            
            if response.status_code == 200:
                data = response.json()
                print("Response Data:")
                # Pretty print dictionary
                import json
                print(json.dumps(data, indent=2))
            else:
                print(f"Error Response: {response.text}")
                
    except Exception as e:
        print(f"Test failed for {endpoint_name}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Test all backend services for the application.")
    parser.add_argument(
        "--image", 
        type=str, 
        required=True, 
        help="Path to the product image you want to test with"
    )
    
    args = parser.parse_args()
    image_path = args.image
    
    print(f"Starting test suite using image: {image_path}")
    
    # 1. Product Authenticity / Verification (First Test)
    test_endpoint("Product Verification (Attempt 1)", f"{API_BASE_URL}/verify", image_path)
    
    # 2. Product Authenticity / Verification (Second Test as requested)
    print("\nWaiting a few seconds before the second verification test...")
    time.sleep(2)
    test_endpoint("Product Verification (Attempt 2)", f"{API_BASE_URL}/verify", image_path)

    # 3. Product Pricing Service
    print("\nWaiting a few seconds before pricing test...")
    time.sleep(2)
    test_endpoint("Product Pricing", f"{API_BASE_URL}/price", image_path)

    # 4. Product Details / Analysis Service
    print("\nWaiting a few seconds before details test...")
    time.sleep(2)
    test_endpoint("Product Details", f"{API_BASE_URL}/details", image_path)
    
    print("\nTesting complete!")

if __name__ == "__main__":
    main()
