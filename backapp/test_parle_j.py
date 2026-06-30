import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from services.gemini_service import gemini_service

def test_parle_j():
    # Use the generated image
    image_path = os.path.join(os.getcwd(), "parle_j_counterfeit.jpg")
    
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        return

    print(f"Testing Parle-J detection with Forensic Authenticator...")
    print(f"Image: {image_path}")
    
    with open(image_path, "rb") as f:
        image_data = f.read()

    try:
        result = gemini_service.verify_product_authenticity(image_data)
        import json
        
        # Save full result
        with open("parle_j_analysis.json", "w") as f:
            json.dump(result, f, indent=2)
        
        # Print summary
        print("\n" + "="*60)
        print("FORENSIC ANALYSIS SUMMARY")
        print("="*60)
        
        if "product_info" in result:
            print(f"\nDetected Brand: {result['product_info'].get('brand', 'Unknown')}")
            print(f"Category: {result['product_info'].get('category', 'Unknown')}")
        
        if "verification" in result:
            print(f"\nVerdict: {result['verification'].get('is_authentic_guess', 'Unknown')}")
            print(f"Confidence: {result['verification'].get('confidence_score', 0)}%")
            print(f"\nAnomalies Detected:")
            for anomaly in result['verification'].get('anomalies_detected', []):
                print(f"  - {anomaly}")
            print(f"\nReasoning: {result['verification'].get('detailed_reasoning', 'N/A')}")
        
        if "raw_forensic_analysis" in result:
            print(f"\n" + "="*60)
            print("DETAILED FORENSIC FLAGS")
            print("="*60)
            for flag in result['raw_forensic_analysis'].get('forensic_flags', []):
                print(f"\n{flag.get('check', 'Unknown Check')}:")
                print(f"  Status: {flag.get('status', 'N/A')}")
                print(f"  Observation: {flag.get('observation', 'N/A')}")
            
            health = result['raw_forensic_analysis'].get('health_safety_assessment', {})
            print(f"\n" + "="*60)
            print("HEALTH & SAFETY ASSESSMENT")
            print("="*60)
            print(f"Risk Level: {health.get('risk_level', 'Unknown')}")
            print(f"Flagged Components: {', '.join(health.get('flagged_components', [])) or 'None'}")
            for warning in health.get('safety_warnings', []):
                print(f"  ⚠ {warning}")
        
        print(f"\n" + "="*60)
        print(f"Full analysis saved to: parle_j_analysis.json")
        print("="*60)
        
    except Exception as e:
        print(f"Service Call Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_parle_j()
