import sys
import os

# Add the current directory to sys.path
sys.path.append(os.getcwd())

from services.gemini_service import gemini_service

def analyze_image():
    # Use the generated Parle-J image
    image_path = r"C:\Users\sangm\.gemini\antigravity\brain\bf16fc43-d910-4101-bfdf-313c7db6d40d\parle_j_test.webp"
    
    if not os.path.exists(image_path):
        print(f"Error: {image_path} not found.")
        print("Please ensure the image has been generated first.")
        return

    print("="*70)
    print("PARLE-J COUNTERFEIT DETECTION TEST")
    print("Using Global Lead Forensic & Safety Authenticator")
    print("="*70)
    print(f"\nAnalyzing: {os.path.basename(image_path)}")
    
    with open(image_path, "rb") as f:
        image_data = f.read()

    try:
        print("\nCalling gemini_service.verify_product_authenticity()...")
        result = gemini_service.verify_product_authenticity(image_data)
        
        import json
        
        # Save full result
        output_file = "parle_j_forensic_report.json"
        with open(output_file, "w") as f:
            json.dump(result, f, indent=2)
        
        # Print formatted summary
        print("\n" + "="*70)
        print("FORENSIC ANALYSIS RESULTS")
        print("="*70)
        
        if "product_info" in result:
            print(f"\n📦 PRODUCT IDENTIFICATION:")
            print(f"   Brand: {result['product_info'].get('brand', 'Unknown')}")
            print(f"   Category: {result['product_info'].get('category', 'Unknown')}")
        
        if "verification" in result:
            verdict = result['verification'].get('is_authentic_guess', 'Unknown')
            confidence = result['verification'].get('confidence_score', 0)
            
            print(f"\n⚖️  VERDICT: {verdict}")
            print(f"   Confidence: {confidence}%")
            
            anomalies = result['verification'].get('anomalies_detected', [])
            if anomalies:
                print(f"\n🚨 ANOMALIES DETECTED ({len(anomalies)}):")
                for i, anomaly in enumerate(anomalies, 1):
                    print(f"   {i}. {anomaly}")
            
            reasoning = result['verification'].get('detailed_reasoning', 'N/A')
            print(f"\n💡 REASONING:")
            for line in reasoning.split('\n'):
                if line.strip():
                    print(f"   {line}")
        
        if "raw_forensic_analysis" in result:
            raw = result['raw_forensic_analysis']
            
            print(f"\n" + "="*70)
            print("DETAILED FORENSIC FLAGS")
            print("="*70)
            
            for flag in raw.get('forensic_flags', []):
                status_icon = "✅" if flag.get('status') == 'PASS' else "❌"
                print(f"\n{status_icon} {flag.get('check', 'Unknown Check')}")
                print(f"   Status: {flag.get('status', 'N/A')}")
                print(f"   Observation: {flag.get('observation', 'N/A')}")
            
            health = raw.get('health_safety_assessment', {})
            if health:
                print(f"\n" + "="*70)
                print("HEALTH & SAFETY ASSESSMENT")
                print("="*70)
                risk = health.get('risk_level', 'Unknown')
                risk_icon = "🟢" if risk == "Safe" else "🟡" if risk == "Caution" else "🔴"
                print(f"\n{risk_icon} Risk Level: {risk}")
                
                components = health.get('flagged_components', [])
                if components:
                    print(f"\n⚠️  Flagged Components:")
                    for comp in components:
                        print(f"   - {comp}")
                
                warnings = health.get('safety_warnings', [])
                if warnings:
                    print(f"\n⚠️  Safety Warnings:")
                    for warning in warnings:
                        print(f"   - {warning}")
            
            recommendation = raw.get('recommendation', '')
            if recommendation:
                print(f"\n" + "="*70)
                print("RECOMMENDATION")
                print("="*70)
                print(f"\n{recommendation}")
        
        print(f"\n" + "="*70)
        print(f"✅ Full analysis saved to: {output_file}")
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ Analysis Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_image()
