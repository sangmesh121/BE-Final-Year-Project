import google.generativeai as genai
import os
import json
from PIL import Image
import io
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not set.")
        else:
            genai.configure(api_key=self.api_key)
            # Use gemini-2.5-flash to avoid 429 Quota limits (Pro has stricter limits)
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    def _prepare_images(self, images_data: list[bytes]) -> list:
        """Helper to convert bytes to PIL Images"""
        processed_images = []
        for img_bytes in images_data:
            try:
                processed_images.append(Image.open(io.BytesIO(img_bytes)))
            except Exception as e:
                print(f"Error loading image: {e}")
        return processed_images

    def extract_features(self, image_bytes: bytes) -> dict:
        if not self.api_key:
             return {"error": "Gemini API Key missing"}

        retries = 3
        delay = 2  # Start with 2 seconds

        for attempt in range(retries):
            try:
                image = Image.open(io.BytesIO(image_bytes))
                
                prompt = """
                You are an expert in product authentication. Analyze this image.
                Extract the following details to help verify if it is authentic:
                1. Brand Name
                2. Product Name / Model
                3. Packaging details (text, logo placement, colors)
                4. A search query to find an official reference image of this exact product.

                Return ONLY a valid JSON object with this structure:
                {
                    "brand": "string",
                    "product_name": "string",
                    "features": ["feature1", "feature2"],
                    "search_query": "string"
                }
                Do not include markdown formatting like ```json ... ```. Just the raw JSON string.
                """
                
                response = self.model.generate_content([prompt, image])
                text = response.text.strip()
                
                # Cleanup markdown if present
                if text and text.startswith("```json"):
                    text = text[7:]
                
                text = response.text.strip()
                
                # Robust JSON extraction
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    return json.loads(json_str)
                else:
                    # Fallback to cleaning markdown if no direct JSON match
                    if text.startswith("```json"):
                        text = text[7:]
                    if text.endswith("```"):
                        text = text[:-3]
                    return json.loads(text)
            
            except json.JSONDecodeError as e:
                error_str = str(e)
                print(f"Gemini API Error (Attempt {attempt+1}/{retries}): JSON Decode Error: {error_str}. Raw text: {text}")
                return {"error": "Failed to parse JSON response from AI", "raw_text": text}
            except Exception as e:
                error_str = str(e)
                print(f"Gemini API Error (Attempt {attempt+1}/{retries}): {error_str}")
                
                # Handle Quota/Rate Limits with exponential backoff
                if "429" in error_str or "quota" in error_str.lower() or "resource exhausted" in error_str.lower():
                    if attempt < retries - 1:
                        wait_time = delay * (2 ** attempt)
                        print(f"Rate limit hit. Retrying in {wait_time}s...")
                        time.sleep(wait_time)
                        continue
            print(f"Gemini Identification Error: {e}")
            return "unknown product"

    def identify_product(self, images_data: list[bytes]) -> str:
        """
        Identifies the product in the images (Front/Back) and returns a search query string.
        """
        if not self.api_key:
             return "unknown product"

        try:
            images = self._prepare_images(images_data)
            if not images: return "unknown product"

            prompt = """
            Identify this product specifically for buying online. 
            Analyze all provided images (Front, Back, Labels).
            Return ONLY the product name (Brand + Model + Colorway if applicable).
            Do not include any other text.
            """
            
            response = self.model.generate_content([prompt] + images)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Identification Error: {e}")
            return "unknown product"

    def analyze_for_details(self, images_data: list[bytes]) -> dict:
        """
        Analyzes images to provide detailed product specifications.
        """
        if not self.api_key:
             return {"error": "Key missing"}

        try:
            images = self._prepare_images(images_data)
            if not images: return {"description": "No valid images.", "specs": []}

            prompt = """
            Analyze this product from all available views (Front, Back, etc.). 
            Provide a comprehensive, engaging description.
            
            Return a JSON object with this structure:
            {
                "description": "A detailed 3-4 sentence paragraph describing the product, its key features, typical usage, and any notable history or brand reputation.",
                "specs": [
                    {"label": "Brand", "value": "string"},
                    {"label": "Model", "value": "string"},
                    {"label": "Type", "value": "string (e.g. Biscuit, Smartphone)"},
                    {"label": "Key Ingredient/Material", "value": "string"},
                    {"label": "Packaging", "value": "string description"}
                ]
            }
            """
            response = self.model.generate_content([prompt] + images)
            text = response.text.strip()
            if text and text.startswith("```json"):
                text = text[7:]
            if text and text.endswith("```"):
                text = text[:-3]
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Details Error: {e}")
            return {"description": "Could not analyze product details.", "specs": []}

    def compare_products(self, input_image_bytes: bytes, reference_image_bytes: bytes) -> dict:
        """
        Compares the input image with a reference image using Gemini to detect counterfeit signs.
        """
        if not self.api_key:
             return {"error": "Key missing"}

        try:
            img1 = Image.open(io.BytesIO(input_image_bytes))
            img2 = Image.open(io.BytesIO(reference_image_bytes))

            prompt = """
            You are an expert counterfeit investigator.
            Image 1 is the suspect product (uploaded by user).
            Image 2 is the official reference product (from a trusted source).

            Compare them strictly. Look for differences in:
            - Logo placement, font, and proportions
            - Stitching quality and patterns
            - Material texture and finish
            - Color shade discrepancies
            - Label details

            If Image 2 is a generic or different product, state that comparison is invalid.

            Return a JSON object:
            {
                "is_authentic": boolean,
                "confidence_score": float (0.0 to 1.0),
                "verdict": "Authentic", "Counterfeit", or "Inconclusive",
                "discrepancies": ["list", "of", "visual", "differences"],
                "reasoning": "Brief summary of why"
            }
            """

            response = self.model.generate_content([prompt, img1, img2])
            text = response.text.strip()

            if text and text.startswith("```json"):
                text = text[7:]
            if text and text.endswith("```"):
                text = text[:-3]

            return json.loads(text)
        except Exception as e:
            print(f"Gemini Comparison Error: {e}")
            return {"error": str(e), "is_authentic": False, "confidence_score": 0.0, "verdict": "Error", "discrepancies": []}

    def verify_product_authenticity(self, images_data: list[bytes]) -> dict:
        """
        Global Lead Forensic & Safety Authenticator Verification.
        Performs deep forensic & safety authentication using multiple views (Front/Back) if available.
        """
        if not self.api_key:
            return {"error": "Gemini API Key missing"}

        try:
            images = self._prepare_images(images_data)
            if not images: return {"error": "No valid images provided"}
        except Exception as e:
            return {"error": f"Invalid image data: {str(e)}"}

        # Define the Global Lead Forensic & Safety Authenticator Prompt
        forensic_prompt = """
        You are the Global Lead for Forensic Product Authentication and Consumer Safety. Your capability includes detecting 99.9% of high-quality counterfeits and identifying Health & Safety Risks in product components.

        INPUT ANALYSIS:
        You have been provided with one or more images.
        - If Multiple Images: Treat them as different views (e.g., Front, Back, Side) of the SAME single product unit. Cross-reference them.
        - Front View: Typically contains the main Logo, Brand Name, and Aesthetics.
        - Back View: Typically contains Ingredients, Nutritional Info, Manufacturer Details, and Barcodes.

        CORE ANALYSIS PROTOCOLS:
        1. Typography Forensics: Analyze font weight, kerning, and serif details. Look for 'bleed' in printed text.
        2. Colorimetry: Detect washed-out colors, incorrect gradients, or mismatched official brand palettes.
        3. Material Physics: Analyze light reflection on packaging. Authentic plastic reflects differently than cheap laminate.
        4. Ingredient & Safety Compliance (CRITICAL for Back View): Analyze extracted text for harmful ingredients, banned additives, or hazardous materials.
        5. Data Correlation: Cross-check information between Front and Back (e.g., Brand on front matches Manufacturer on back).

        OUTPUT REQUIREMENT:
        You must return ONLY a raw JSON object. Do not include markdown formatting like ```json ... ```.

        PERFORM DEEP FORENSIC & SAFETY AUTHENTICATION.

        Target Information:
        Claimed Brand: Unknown - Detect from Images
        Category: Unknown - Detect from Images

        EXECUTION STEPS:

        1. OCR & Spell Check: Extract ALL visible text from ALL images.
           - Detect 'Typosquatting' (e.g., 'Parle-J' vs 'Parle-G').
           - Match Brand Name on Front with Manufacturer Info on Back.
           Action: If a typo is found in the main logo, IMMEDIATE VERDICT: 'Counterfeit'.

        2. Health & Safety Audit (Component Analysis):
           - Food/Pharma: Scan the 'Ingredients' list. Flag Banned Substances (e.g., Potassium Bromate, Red 3). Flag Misleading Claims. Flag Allergen Warnings.
           - Cosmetics: Look for hazardous chemicals like Hydroquinone, Mercury, or Steroids.
           - Electronics/Toys: Look for missing 'CE', 'RoHS', or 'Non-Toxic' safety certifications.

        3. Logo & Graphic Analysis:
           - Is the logo pixelated? (Indicates scanning/reprinting).
           - Are the regulatory logos (FSSAI, CE, FCC, Eco-marks) sharp and legally accurate?

        4. QR/Barcode Scan:
           - Analyze clarity. Is it a unique high-res code or a fuzzy static image?

        JSON RESPONSE STRUCTURE:
        {
          "verdict": "Authentic" | "Counterfeit" | "Suspicious" | "Unverifiable",
          "confidence_score": <float 0.0-1.0>,
          "detected_brand": "<Name read from OCR>",
          "category_detected": "<e.g., Food, Electronics>",
          "forensic_flags": [
            {
              "check": "Spelling Check",
              "status": "PASS" | "FAIL",
              "observation": "Found 'Parle-J' instead of 'Parle-G'"
            }
          ],
          "health_safety_assessment": {
            "risk_level": "Safe" | "Caution" | "High Risk" | "Critical",
            "flagged_components": ["<Ingredient 1>", "<Ingredient 2>"],
            "safety_warnings": ["<Specific warning, e.g., Contains High Sugar despite 'Healthy' claim>"]
          },
          "reasoning": "<Executive summary of the findings>",
          "recommendation": "<Advice for the user>"
        }
        """

        import time
        retries = 3
        delay = 5 # Reduced initial delay, will backoff

        for attempt in range(retries):
            try:
                # Add 'Generate Content' configuration if needed, but default is usually fine
                contents = [forensic_prompt] + images
                response = self.model.generate_content(contents)
                text = response.text.strip()
                
                # Robust JSON extraction
                import re
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    result = json.loads(json_str)
                else:
                    # Try cleaning markdown
                    if text.startswith("```json"):
                        text = text[7:]
                    if text.endswith("```"):
                        text = text[:-3]
                    result = json.loads(text)
                
                # Basic validation of structure
                if "verdict" not in result:
                     # Attempt to map if the model drifted, or just raise error
                     pass 

                # Normalize output to match what frontend/backend expects if necessary
                # The prompt returns specific keys, we might need to wrap them to match the API response structure 
                # expected by verify code in main.py. 
                # main.py expects: product_info, verification (is_authentic_guess, confidence_score, anomalies_detected, detailed_reasoning)
                
                # MAPPING ADAPTER
                is_auth = "Authentic" if result.get("verdict") == "Authentic" else "Counterfeit"
                if result.get("verdict") == "Suspicious": is_auth = "Counterfeit" # Treat suspicious as counterfeit-adjacent for safety
                
                formatted_result = {
                    "product_info": {
                        "brand": result.get("detected_brand", "Unknown"),
                        "model": "Detected",
                        "category": result.get("category_detected", "Unknown")
                    },
                    "verification": {
                        "is_authentic_guess": is_auth,
                        "confidence_score": int(result.get("confidence_score", 0) * 100),
                        "anomalies_detected": [flag["observation"] for flag in result.get("forensic_flags", []) if flag["status"] == "FAIL"] + result.get("health_safety_assessment", {}).get("safety_warnings", []),
                        "detailed_reasoning": result.get("reasoning", "") + "\n\nHealth Risk: " + result.get("health_safety_assessment", {}).get("risk_level", "Unknown")
                    },
                    # Include the raw new structure too if we want to use it later
                    "raw_forensic_analysis": result
                }
                
                return formatted_result

            except Exception as e:
                error_msg = str(e)
                if ("429" in error_msg or "quota" in error_msg.lower()) and attempt < retries - 1:
                    print(f"Quota hit in verification. Retrying in {delay}s...")
                    time.sleep(delay)
                    delay *= 2 
                    continue
                
                print(f"Verification error (Attempt {attempt+1}): {e}")
                if attempt == retries - 1:
                     return {
                        "error": f"Verification failed: {str(e)}",
                        "product_info": {"brand": "Unknown", "model": "Unknown", "category": "Unknown"},
                        "verification": {
                            "is_authentic_guess": "Error",
                            "confidence_score": 0,
                            "anomalies_detected": ["System Error"],
                            "detailed_reasoning": f"Service unavailable: {str(e)}"
                        }
                    }

gemini_service = GeminiService()

