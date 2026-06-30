import os
import requests
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from services.gemini_service import gemini_service
from services.search_service import search_service
from services.verification_service import verification_service
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins =["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Product Verification API"}

@app.post("/verify")
async def verify_product(
    file: UploadFile = File(None), 
    front_image: UploadFile = File(None), 
    back_image: UploadFile = File(None)
):
    """
    Verifies product authenticity using Chain-of-Thought Gemini analysis.
    Works across all product categories without needing reference images or datasets.
    Supports optional Front and Back images for better accuracy.
    """
    images_data = []
    filenames = []
    
    # helper to process upload
    async def add_image(upload_file):
        if upload_file:
            content = await upload_file.read()
            images_data.append(content)
            filenames.append(upload_file.filename)

    await add_image(file)
    await add_image(front_image)
    await add_image(back_image)
    
    print(f"Received CoT verification request for: {filenames}")
    
    if not images_data:
        raise HTTPException(status_code=400, detail="At least one image (file, front_image, or back_image) must be provided")
    
    try:
        # First identify the product to decide routing
        product_name = gemini_service.identify_product(images_data).lower()
        print(f"Initial identification from Gemini: {product_name}")
        
        if "nike" in product_name and ("shoe" in product_name or "sneaker" in product_name):
            print("Nike shoe detected! Routing to local counterfeit model...")
            from services.nike_verification_service import nike_verification_service
            cot_result = nike_verification_service.verify_nike_shoes(images_data)
        else:
            # Use the general Chain-of-Thought verification method for other products
            print("Running general Chain-of-Thought verification via Gemini...")
            cot_result = gemini_service.verify_product_authenticity(images_data)
        
        # Check for errors in the CoT result
        if "error" in cot_result and cot_result.get("verification", {}).get("is_authentic_guess") == "Error":
            print(f"Verification error: {cot_result.get('error')}")
            # Don't raise exception - return the error structure for frontend to handle
        
        # Extract verification details
        product_info = cot_result.get("product_info", {})
        verification = cot_result.get("verification", {})
        
        # Format the response
        result = {
            "filename": ", ".join(filenames),
            "product_info": {
                "brand": product_info.get("brand", "Unknown"),
                "model": product_info.get("model", "Unknown"),
                "category": product_info.get("category", "Unknown")
            },
            "verification_result": {
                "is_authentic": verification.get("is_authentic_guess") == "Authentic",
                "verdict": verification.get("is_authentic_guess", "Error"),
                "confidence_score": verification.get("confidence_score", 0) / 100,  # Convert to 0-1 scale
                "anomalies": verification.get("anomalies_detected", []),
                "reasoning": verification.get("detailed_reasoning", "No analysis available"),
                "method": "Chain-of-Thought (CoT) Forensic Analysis"
            },
            "raw_forensic_analysis": cot_result.get("raw_forensic_analysis", {})
        }
        
        print(f"CoT Verification complete: {result['verification_result']['verdict']} ({result['verification_result']['confidence_score']*100:.0f}%)")
        print(f"Product: {result['product_info']['brand']} {result['product_info']['model']} ({result['product_info']['category']})")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Verification Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/price")
async def check_price(
    file: UploadFile = File(None),
    front_image: UploadFile = File(None),
    back_image: UploadFile = File(None),
    sort: str = "price_asc"
):
    """
    Checks online prices for the product in the images.
    """
    images_data = []
    
    async def add_image(upload_file):
        if upload_file:
            images_data.append(await upload_file.read())

    await add_image(file)
    await add_image(front_image)
    await add_image(back_image)
    
    if not images_data:
        raise HTTPException(status_code=400, detail="At least one image must be provided")
    
    try:
        # 1. Identify Product Name
        product_name = gemini_service.identify_product(images_data)
        print(f"Identified product: {product_name}")
        
        # 2. Find Prices
        print(f"Finding prices for: {product_name}")
        prices = search_service.find_product_prices(product_name)
        
        # 3. Sort Results
        if sort == "price_asc":
            prices.sort(key=lambda x: x["price"])
        elif sort == "price_desc":
            prices.sort(key=lambda x: x["price"], reverse=True)
        elif sort == "rating":
            prices.sort(key=lambda x: x["rating"], reverse=True)
            
        return {
            "product_name": product_name,
            "prices": prices
        }
    
    except Exception as e:
        print(f"Price Check Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/details")
async def get_details(
    file: UploadFile = File(None),
    front_image: UploadFile = File(None),
    back_image: UploadFile = File(None)
):
    """
    Analyzes images to provide detailed product specifications.
    """
    images_data = []
    filenames = []
    
    async def add_image(upload_file):
        if upload_file:
            images_data.append(await upload_file.read())
            filenames.append(upload_file.filename)

    await add_image(file)
    await add_image(front_image)
    await add_image(back_image)
    
    if not images_data:
        raise HTTPException(status_code=400, detail="At least one image must be provided")
    
    try:
        details = gemini_service.analyze_for_details(images_data)
        
        return {
            **details,
            "filename": ", ".join(filenames)
        }
    except Exception as e:
        print(f"Details Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
