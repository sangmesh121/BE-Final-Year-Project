import requests
from PIL import Image, ImageDraw, ImageFont
import io

def create_test_image():
    # Create a white image
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    
    # Add text simulating the product
    # We don't have a specific font, so default will be used, might be small but readable by Gemini
    try:
        # Try to load a font if available, else default
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()

    d.text((50, 50), "Ranitidine Hydrochloride Tablets I.P.", fill='black', font=font)
    d.text((50, 150), "RANITIN 150", fill='green', font=font)
    d.text((50, 250), "PharmEasy", fill='gray', font=font)
    d.text((50, 350), "Batch No. GTX1234EXP", fill='black', font=font)
    
    # Save to bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    return img_byte_arr.getvalue()

def test_verify():
    url = "http://127.0.0.1:8000/verify"
    image_bytes = create_test_image()
    
    files = {
        'file': ('test_ranitin.jpg', image_bytes, 'image/jpeg')
    }
    
    print("Sending request to /verify with synthetic Ranitin 150 image...")
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response JSON:")
            import json
            print(json.dumps(response.json(), indent=2))
        else:
            print("Error Response:")
            print(response.text)
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_verify()
