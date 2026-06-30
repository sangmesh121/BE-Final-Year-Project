from dotenv import load_dotenv
load_dotenv()

import requests
import os
import json

# Test images
test_images = [
    r"C:\Users\sangm\Downloads\Good_Day_Fruit_and_Nut_Style_31158a9f6e.png"
]

url = "http://localhost:8000/verify"

for img_path in test_images:
    if not os.path.exists(img_path):
        print(f"❌ Image not found: {img_path}")
        continue
    
    print(f"\n{'='*70}")
    print(f"🔍 Testing: {os.path.basename(img_path)}")
    print('='*70)
    
    try:
        with open(img_path, "rb") as f:
            files = {"file": (os.path.basename(img_path), f, "image/*")}
            response = requests.post(url, files=files, timeout=90)
            
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ VERIFICATION SUCCESS!\n")
            
            # Product Info
            product_info = data.get('product_info', {})
            print(f"📦 PRODUCT INFORMATION:")
            print(f"   Brand:    {product_info.get('brand', 'N/A')}")
            print(f"   Model:    {product_info.get('model', 'N/A')}")
            print(f"   Category: {product_info.get('category', 'N/A')}")
            
            # Verification Result
            verification = data.get('verification_result', {})
            verdict = verification.get('verdict', 'N/A')
            confidence = verification.get('confidence_score', 0) * 100
            
            # Emoji based on verdict
            verdict_emoji = {
                'Authentic': '✅',
                'Counterfeit': '❌',
                'Suspect': '⚠️',
                'Error': '🛑'
            }.get(verdict, '❓')
            
            print(f"\n{verdict_emoji} VERIFICATION RESULT:")
            print(f"   Verdict:    {verdict}")
            print(f"   Confidence: {confidence:.1f}%")
            print(f"   Method:     {verification.get('method', 'N/A')}")
            
            # Anomalies
            anomalies = verification.get('anomalies', [])
            if anomalies:
                print(f"\n🔴 ANOMALIES DETECTED:")
                for i, a in enumerate(anomalies, 1):
                    print(f"   {i}. {a}")
            else:
                print(f"\n✓ No anomalies detected")
            
            # Reasoning
            reasoning = verification.get('reasoning', 'N/A')
            print(f"\n💭 DETAILED REASONING:")
            # Wrap text at 65 characters
            words = reasoning.split()
            line = "   "
            for word in words:
                if len(line) + len(word) + 1 > 68:
                    print(line)
                    line = "   " + word
                else:
                    line += " " + word if line != "   " else word
            if line.strip():
                print(line)
                
        else:
            print(f"\n❌ REQUEST FAILED")
            print(f"Response: {response.text[:500]}")
            
    except requests.exceptions.Timeout:
        print(f"❌ TIMEOUT: Request took too long (>90s)")
    except Exception as e:
        print(f"❌ ERROR: {e}")

print(f"\n{'='*70}")
print("✨ Testing Complete")
print('='*70)
