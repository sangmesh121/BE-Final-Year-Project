
import os
from dotenv import load_dotenv
from services.search_service import search_service

# Load env to ensure keys are present
load_dotenv()

def test_india_search():
    query = "Maggi Noodles"
    print(f"Testing Search for: {query} (Expect India Results)")
    
    results = search_service.find_product_prices(query)
    
    if not results:
        print("No results found.")
        return

    print(f"Found {len(results)} results.")
    
    is_india = False
    for res in results:
        title = res.get('title', 'No Title')
        print(f"- Seller: {res.get('seller')}, Price: {res.get('currency')}{res.get('price')}, Title: {title}")
        
        # Check for Indian currency symbol
        if res['currency'] == '₹':
            is_india = True
            
        # Check for Indian domains in link
        if ".in" in res['link'] or "flipkart" in res['link'] or "blinkit" in res['link']:
            is_india = True

    if is_india:
        print("\n✅ SUCCESS: Results detected as Indian (₹ or .in domains found).")
    else:
        print("\n❌ WARNING: Results might not be specific to India (No ₹ or common Indian domains detected).")

if __name__ == "__main__":
    test_india_search()
