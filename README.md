# Countify - Counterfeit Product Detection

A full-stack application to verify product authenticity, check prices, and get detailed specifications using AI.

## 🚀 Getting Started

### 1. Backend Setup (Python)
The backend handles AI analysis (Gemini) and search (DuckDuckGo).

1.  Navigate to the backend folder:
    ```bash
    cd backapp
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Create a `.env` file in `backapp/` and add your keys:
    ```env
    GEMINI_API_KEY=your_google_gemini_key
    SEARCH_API_KEY=your_serpapi_key  # Optional (Falls back to DuckDuckGo)
    ```
4.  Run the server:

    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

### 2. Frontend Setup (React Native / Expo)
The mobile/web app for scanning products.

1.  Navigate to the frontend folder:
    ```bash
    cd frontendbe
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the app:
    ```bash
    npx expo start
    ```
4.  **To Run:**
    -   **Web**: Press `w` in the terminal.
    -   **Mobile**: Scan the QR code with the **Expo Go** app (Android/iOS).

## features
-   **Verify Authenticity**: AI feature analysis + visual reference check.
-   **Check Price**: Find best online prices and sellers.
-   **Product Details**: Get detailed specs and description.


**##libraries**
fastapi
uvicorn
python-multipart
requests
numpy
pillow
opencv-python-headless
tensorflow
google-generativeai
python-dotenv
