
import sys
import os
import json
from services.gemini_service import GeminiService

# Set console output to utf-8 to handle emojis
sys.stdout.reconfigure(encoding='utf-8')

def run_verification():
    # Image path - default to parle_test.jpg if not provided
    img_path = sys.argv[1] if len(sys.argv) > 1 else "parle_test.jpg"
    
    if not os.path.exists(img_path):
        print(f"❌ Image not found: {img_path}")
        print("Usage: python direct_verify_product.py <image_path>")
        return

    # Redirect output to file with utf-8 encoding
    with open("verification_result_utf8.txt", "w", encoding="utf-8") as f:
        sys.stdout = f
        
        print(f"🔍 Verifying: {os.path.basename(img_path)}")
        print("-" * 50)

        try:
            # Initialize service
            service = GeminiService()
            
            # Read image
            with open(img_path, "rb") as img_file:
                image_bytes = img_file.read()

            # Run verification with retries for Gemini 3 Pro quota
            import time
            result = None
            for attempt in range(3):
                try:
                    result = service.verify_product_authenticity(image_bytes)
                    if result and "error" in result and "busy" in result["error"].lower():
                         print(f"API busy (Attempt {attempt+1}). Waiting 40s...")
                         time.sleep(40)
                         continue
                    break
                except Exception as service_err:
                    print(f"Service error: {service_err}")
                    time.sleep(10)
            
            if not result:
                print("❌ Failed to get results after retries.")
                return
            
            # Print results nicely
            print("\n✅ VERIFICATION COMPLETE!\n")
            
            # Product Info
            product_info = result.get('product_info', {})
            print(f"📦 PRODUCT INFORMATION:")
            print(f"   Brand:    {product_info.get('brand', 'N/A')}")
            print(f"   Model:    {product_info.get('model', 'N/A')}")
            print(f"   Category: {product_info.get('category', 'N/A')}")
            
            # Verification Result
            verification = result.get('verification', {})
            verdict = verification.get('is_authentic_guess', 'N/A')
            confidence = verification.get('confidence_score', 0)
            
            # Emoji based on verdict
            verdict_emoji = {
                'Authentic': '✅',
                'Counterfeit': '❌',
                'Suspect': '⚠️',
                'Error': '🛑'
            }.get(verdict, '❓')
            
            print(f"\n{verdict_emoji} VERIFICATION RESULT:")
            print(f"   Verdict:    {verdict}")
            print(f"   Confidence: {confidence}%")
            
            # Anomalies
            anomalies = verification.get('anomalies_detected', [])
            if anomalies:
                print(f"\n🔴 ANOMALIES DETECTED:")
                for i, a in enumerate(anomalies, 1):
                    print(f"   {i}. {a}")
            else:
                print(f"\n✓ No anomalies detected")
            
            # Reasoning
            reasoning = verification.get('detailed_reasoning', 'N/A')
            print(f"\n💭 DETAILED REASONING:")
            print(f"   {reasoning}")

        except Exception as e:
            print(f"❌ Error during verification: {str(e)}")
            import traceback
            traceback.print_exc()
        finally:
            sys.stdout = sys.__stdout__

if __name__ == "__main__":
    run_verification()
