import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class VerificationService:
    def __init__(self):
        # Load pre-trained ResNet50
        self.model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        # Remove the last fully connected layer to get embeddings
        self.model = nn.Sequential(*list(self.model.children())[:-1])
        self.model.eval()
        
        self.preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def get_embedding(self, image_bytes: bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            input_tensor = self.preprocess(image)
            input_batch = input_tensor.unsqueeze(0)  # Add batch dimension

            with torch.no_grad():
                embedding = self.model(input_batch)
            
            # Flatten to 1D array
            return embedding.numpy().flatten()
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None

    def compare_images(self, img1_bytes: bytes, img2_bytes: bytes) -> dict:
        emb1 = self.get_embedding(img1_bytes)
        emb2 = self.get_embedding(img2_bytes)

        if emb1 is None or emb2 is None:
            return {"error": "Failed to process images"}

        # Reshape for sklearn cosine_similarity (Expects 2D array)
        score = cosine_similarity([emb1], [emb2])[0][0]
        
        # Define a threshold (tuning required)
        is_authentic = bool(score > 0.50)

        return {
            "similarity_score": float(score),
            "is_authentic": is_authentic,
            "verdict": "Authentic" if is_authentic else "Potential Counterfeit"
        }

verification_service = VerificationService()
