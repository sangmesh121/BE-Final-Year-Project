
from dotenv import load_dotenv
load_dotenv()

from services.search_service import search_service
import json

def verify_links_live():
    query = "Maggi Noodles"
    print(f"Testing SearchService for: {query}")
    
    results = search_service.find_product_prices(query)
    
    if not results:
        print("No results returned.")
        return

    print(f"Found {len(results)} results.")
    for i, res in enumerate(results):
        print(f"[{i}] Seller: {res.get('seller')}")
        print(f"    Link: '{res.get('link')}'")
        # print full dict for the first one to be sure
        if i == 0:
            print("Full Item Dict:", json.dumps(res, indent=2))

if __name__ == "__main__":
    verify_links_live()
