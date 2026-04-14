import os
import torch

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "efficientnet_b3_dermato_23classes_enriched_mobile.pt"
)

print("Chemin du modèle :", MODEL_PATH)

model = torch.jit.load(MODEL_PATH, map_location="cpu")
model.eval()

print("✅ Modèle chargé avec succès")