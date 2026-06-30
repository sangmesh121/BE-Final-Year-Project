import requests
import os

# Configuration
API_URL = "http://127.0.0.1:8000"
IMAGE_PATH = "generated_test_image.jpg" # Will generate a simple image
IMAGE_PATH_2 = "generated_test_image_2.jpg"

def generate_test_images():
    from PIL import Image, ImageDraw
    
    # Image 1: Front
    img1 = Image.new('RGB', (100, 100), color = 'red')
    d1 = ImageDraw.Draw(img1)
    d1.text((10,10), "FRONT VIEW", fill='white')
    img1.save(IMAGE_PATH)
    
    # Image 2: Back
    img2 = Image.new('RGB', (100, 100), color = 'blue')
    d2 = ImageDraw.Draw(img2)
    d2.text((10,10), "BACK VIEW", fill='white')
    img2.save(IMAGE_PATH_2)
    print("Generated test images.")

def test_verify_single():
    print("\n--- Testing Single Image (/verify) ---")
    files = {'file': open(IMAGE_PATH, 'rb')}
    try:
        response = requests.post(f"{API_URL}/verify", files=files)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json().get('verification_result', {}).get('verdict', 'No Verdict')}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files['file'].close()

def test_verify_dual():
    print("\n--- Testing Dual Image (/verify) ---")
    files = [
        ('front_image', ('front.jpg', open(IMAGE_PATH, 'rb'), 'image/jpeg')),
        ('back_image', ('back.jpg', open(IMAGE_PATH_2, 'rb'), 'image/jpeg'))
    ]
    try:
        response = requests.post(f"{API_URL}/verify", files=files)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Success! Dual images accepted.")
            print(f"Filenames processed: {response.json().get('filename')}")
        else:
            print(f"Failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        for _, (name, f, _) in files:
            f.close()

def test_price_dual():
    print("\n--- Testing Dual Image (/price) ---")
    files = [
        ('front_image', ('front.jpg', open(IMAGE_PATH, 'rb'), 'image/jpeg')),
        ('back_image', ('back.jpg', open(IMAGE_PATH_2, 'rb'), 'image/jpeg'))
    ]
    try:
        response = requests.post(f"{API_URL}/price", files=files)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Product Identified: {response.json().get('product_name')}")
        else:
            print(f"Failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        for _, (name, f, _) in files:
            f.close()

if __name__ == "__main__":
    generate_test_images()
    test_verify_single()
    test_verify_dual()
    test_price_dual()
