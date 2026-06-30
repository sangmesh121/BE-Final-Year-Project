from dotenv import load_dotenv
load_dotenv()

import requests
import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Test image
img_path = r"C:\Users\sangm\Downloads\246d6da6-e8e9-491d-8fb8-700ba0ad8bd6.png"

url = "http://localhost:8000/verify"

def log(msg):
    print(msg)
    with open("verify_report.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

# Clear report file
with open("verify_report.txt", "w", encoding="utf-8") as f:
    f.write("")

if not os.path.exists(img_path):
    log(f"❌ Image not found: {img_path}")
    sys.exit(1)

log(f"\n{'='*70}")
log(f"🔍 Testing: {os.path.basename(img_path)}")
log('='*70)

try:
    with open(img_path, "rb") as f:
        files = {"file": (os.path.basename(img_path), f, "image/jpeg")}
        response = requests.post(url, files=files, timeout=90)
        
    log(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        log(f"\n✅ VERIFICATION SUCCESS!\n")
        
        # Product Info
        product_info = data.get('product_info', {})
        log(f"📦 PRODUCT INFORMATION:")
        log(f"   Brand:    {product_info.get('brand', 'N/A')}")
        log(f"   Model:    {product_info.get('model', 'N/A')}")
        log(f"   Category: {product_info.get('category', 'N/A')}")
        
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
        
        log(f"\n{verdict_emoji} VERIFICATION RESULT:")
        log(f"   Verdict:    {verdict}")
        log(f"   Confidence: {confidence:.1f}%")
        log(f"   Method:     {verification.get('method', 'N/A')}")
        
        # Anomalies
        anomalies = verification.get('anomalies', [])
        if anomalies:
            log(f"\n🔴 ANOMALIES DETECTED:")
            for i, a in enumerate(anomalies, 1):
                log(f"   {i}. {a}")
        else:
            log(f"\n✓ No anomalies detected")
        
        # Reasoning
        reasoning = verification.get('reasoning', 'N/A')
        log(f"\n💭 DETAILED REASONING:")
        # Wrap text at 65 characters
        words = reasoning.split()
        line = "   "
        for word in words:
            if len(line) + len(word) + 1 > 68:
                log(line)
                line = "   " + word
            else:
                line += " " + word if line != "   " else word
        if line.strip():
            log(line)
            
    else:
        log(f"\n❌ REQUEST FAILED")
        log(f"Response: {response.text[:500]}")
        
except requests.exceptions.Timeout:
    log(f"❌ TIMEOUT: Request took too long (>90s)")
except Exception as e:
    log(f"❌ ERROR: {e}")

log(f"\n{'='*70}")
log("✨ Testing Complete")
log('='*70)
