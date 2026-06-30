import requests
import os
import json
import time

API_BASE_URL = "http://127.0.0.1:8000"

IMAGE_1 = r"C:\Users\sangm\Downloads\Unibic-Fruit-and-Nut-300g-f.jpg"
IMAGE_2 = r"C:\Users\sangm\Downloads\unnamed.jpg"

class TestSuite:
    def __init__(self):
        self.total = 0
        self.passed = 0
        self.failed = 0
        self.results = []

    def run_test(self, name, condition_func):
        self.total += 1
        try:
            passed = condition_func()
            if passed:
                self.passed += 1
                self.results.append((name, "PASSED"))
                print(f"[✅ PASSED] {name}")
            else:
                self.failed += 1
                self.results.append((name, "FAILED"))
                print(f"[❌ FAILED] {name}")
        except Exception as e:
            self.failed += 1
            self.results.append((name, f"ERROR: {str(e)}"))
            print(f"[⚠️ ERROR] {name} - {str(e)}")

    def summary(self):
        print("\n" + "="*50)
        print(f"       TEST SUITE SUMMARY       ")
        print("="*50)
        print(f"Total Test Cases Run: {self.total}")
        print(f"Total Passed:         {self.passed}")
        print(f"Total Failed/Errors:  {self.failed}")
        print("="*50)

def main():
    suite = TestSuite()
    
    print("\nStarting Automated Local API Test Suite (24+ Cases)...\n")

    # 1-4: Basic System & File Checks
    suite.run_test("TC01: Backend API is reachable", lambda: requests.get(API_BASE_URL).status_code == 200)
    suite.run_test("TC02: Root endpoint returns JSON", lambda: 'message' in requests.get(API_BASE_URL).json())
    suite.run_test("TC03: Image 1 exists on disk (Unibic)", lambda: os.path.exists(IMAGE_1))
    suite.run_test("TC04: Image 2 exists on disk (Unnamed/Nike)", lambda: os.path.exists(IMAGE_2))

    if not os.path.exists(IMAGE_1) or not os.path.exists(IMAGE_2):
        print("\nCritical Error: One or both images not found on disk. Tests that rely on files will fail.")

    # 5-7: Edge Cases - Sending requests without files
    res_no_file_verify = requests.post(f"{API_BASE_URL}/verify")
    suite.run_test("TC05: /verify gracefully rejects request without file", lambda: res_no_file_verify.status_code in [400, 422])
    res_no_file_price = requests.post(f"{API_BASE_URL}/price")
    suite.run_test("TC06: /price gracefully rejects request without file", lambda: res_no_file_price.status_code in [400, 422])
    res_no_file_details = requests.post(f"{API_BASE_URL}/details")
    suite.run_test("TC07: /details gracefully rejects request without file", lambda: res_no_file_details.status_code in [400, 422])

    print("\n--- Running Core Verification Flow on Image 1 ---")
    data_img1 = None
    if os.path.exists(IMAGE_1):
        with open(IMAGE_1, 'rb') as f:
            res_img1 = requests.post(f"{API_BASE_URL}/verify", files={'file': (os.path.basename(IMAGE_1), f, 'image/jpeg')})
            if res_img1.status_code == 200:
                data_img1 = res_img1.json()
                
    suite.run_test("TC08: Image 1 /verify endpoint HTTP status is 200", lambda: res_img1.status_code == 200)
    suite.run_test("TC09: Image 1 /verify returns valid JSON response", lambda: data_img1 is not None)
    suite.run_test("TC10: Image 1 /verify contains product_info object", lambda: 'product_info' in data_img1)
    suite.run_test("TC11: Image 1 /verify identifies brand successfully", lambda: 'brand' in data_img1['product_info'])
    suite.run_test("TC12: Image 1 /verify contains verification_result object", lambda: 'verification_result' in data_img1)
    suite.run_test("TC13: Image 1 /verify contains confidence_score", lambda: 'confidence_score' in data_img1['verification_result'])
    suite.run_test("TC14: Image 1 /verify confidence score is within 0-1", lambda: 0 <= data_img1['verification_result']['confidence_score'] <= 1)
    suite.run_test("TC15: Image 1 /verify tracks analysis method used", lambda: 'method' in data_img1['verification_result'])

    print("\n--- Running Core Verification Flow on Image 2 ---")
    data_img2 = None
    if os.path.exists(IMAGE_2):
        with open(IMAGE_2, 'rb') as f:
            res_img2 = requests.post(f"{API_BASE_URL}/verify", files={'file': (os.path.basename(IMAGE_2), f, 'image/jpeg')})
            if res_img2.status_code == 200:
                data_img2 = res_img2.json()

    suite.run_test("TC16: Image 2 /verify endpoint HTTP status is 200", lambda: res_img2.status_code == 200)
    suite.run_test("TC17: Image 2 /verify contains verification_result object", lambda: data_img2 is not None and 'verification_result' in data_img2)
    suite.run_test("TC18: Image 2 /verify outputs verdict correctly", lambda: data_img2 is not None and 'verdict' in data_img2['verification_result'])

    print("\n--- Running Price Service on Image 1 ---")
    data_price = None
    if os.path.exists(IMAGE_1):
        with open(IMAGE_1, 'rb') as f:
            res_price = requests.post(f"{API_BASE_URL}/price", files={'file': (os.path.basename(IMAGE_1), f, 'image/jpeg')})
            if res_price.status_code == 200:
                data_price = res_price.json()
    
    suite.run_test("TC19: Image 1 /price endpoint HTTP status is 200", lambda: res_price.status_code == 200)
    suite.run_test("TC20: Image 1 /price returns product_name string", lambda: data_price is not None and 'product_name' in data_price)
    suite.run_test("TC21: Image 1 /price returns prices array", lambda: data_price is not None and isinstance(data_price.get('prices'), list))

    print("\n--- Running Details Service on Image 1 ---")
    data_details = None
    if os.path.exists(IMAGE_1):
        with open(IMAGE_1, 'rb') as f:
            res_details = requests.post(f"{API_BASE_URL}/details", files={'file': (os.path.basename(IMAGE_1), f, 'image/jpeg')})
            if res_details.status_code == 200:
                data_details = res_details.json()

    suite.run_test("TC22: Image 1 /details endpoint HTTP status is 200", lambda: res_details.status_code == 200)
    suite.run_test("TC23: Image 1 /details returns product description", lambda: data_details is not None and 'description' in data_details)
    suite.run_test("TC24: Image 1 /details returns specs array", lambda: data_details is not None and isinstance(data_details.get('specs'), list))

    # Print Final Summary
    suite.summary()

if __name__ == '__main__':
    main()
