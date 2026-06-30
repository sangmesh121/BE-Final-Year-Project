import tensorflow as tf
import numpy as np
from PIL import Image
import io

class NikeVerificationService:
    def __init__(self, model_path='best_v3.keras'):
        try:
            self.model = tf.keras.models.load_model(model_path)
            self.target_size = (224, 224) 
            print("Nike verification model loaded successfully.")
        except Exception as e:
            print(f"Error loading Nike verification model: {e}")
            self.model = None

    def verify_nike_shoes(self, images_data: list[bytes]) -> dict:
        if not self.model:
            return {
                "error": "Model not loaded",
                "verification": {
                    "is_authentic_guess": "Error",
                    "confidence_score": 0,
                    "anomalies_detected": ["Local model not available."],
                    "detailed_reasoning": "Failed to load counterfeit_model."
                }
            }

        try:
            # We use the first image provided for the local model
            img = Image.open(io.BytesIO(images_data[0])).convert('RGB')
            img = img.resize(self.target_size)
            x = tf.keras.preprocessing.image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            
            # Run prediction
            preds = self.model.predict(x, verbose=0)[0]
            predicted_class = int(np.argmax(preds))
            confidence = float(preds[predicted_class])
            
            # Assuming class 0 correlates with Authentic in most basic alphabetical schemas
            # If the user trained specifically on genuine/counterfeit, class 0 = Authentic, class 1 = Counterfeit (or vice-versa).
            # We will assume class 0 is Authentic for now.
            if predicted_class == 0:
                is_auth = "Authentic"
            else:
                is_auth = "Counterfeit"
            
            return {
                "product_info": {
                    "brand": "Nike",
                    "model": "Shoes",
                    "category": "Footwear"
                },
                "verification": {
                    "is_authentic_guess": is_auth,
                    "confidence_score": int(confidence * 100),
                    "anomalies_detected": ["Model detected potential counterfeit features"] if is_auth == "Counterfeit" else [],
                    "detailed_reasoning": f"Local AI model analyzed the image and classified it as {is_auth} with {confidence*100:.1f}% confidence."
                },
                "raw_forensic_analysis": {
                    "verdict": is_auth,
                    "confidence_score": confidence,
                    "prediction_array": preds.tolist()
                }
            }
        except Exception as e:
            print(f"Error during Nike verification inference: {e}")
            return {
                "error": str(e),
                "verification": {
                    "is_authentic_guess": "Error",
                    "confidence_score": 0,
                    "anomalies_detected": ["Inference failed"],
                    "detailed_reasoning": f"Exception occurred during model inference: {str(e)}"
                }
            }

nike_verification_service = NikeVerificationService()
