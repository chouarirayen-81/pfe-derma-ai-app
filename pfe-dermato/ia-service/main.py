from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image, ImageOps
from pathlib import Path
import io
import json
import time
import torch
import torch.nn.functional as F
from torchvision import transforms

app = FastAPI(title="DermaScan IA Service")

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "efficientnet_b3_dermato_23classes_enriched_mobile.pt"
LABELS_PATH = BASE_DIR / "labels.json"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Prétraitement aligné sur ton eval_transform d'entraînement
transform = transforms.Compose([
    transforms.Resize((320, 320)),
    transforms.CenterCrop(300),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def load_labels(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Cas recommandé : liste ordonnée
    if isinstance(data, list):
        return data

    # Cas possible : dict {"0": "...", "1": "..."}
    if isinstance(data, dict):
        try:
            return [data[str(i)] for i in range(len(data))]
        except Exception as e:
            raise RuntimeError(f"labels.json invalide : {e}")

    raise RuntimeError("labels.json doit être une liste JSON ou un dict indexé.")


try:
    model = torch.jit.load(str(MODEL_PATH), map_location=device)
    model.eval()

    CLASS_NAMES = load_labels(LABELS_PATH)

    # Validation au démarrage
    with torch.no_grad():
        dummy = torch.zeros(1, 3, 300, 300, device=device)
        logits = model(dummy)

    if logits.ndim != 2:
        raise RuntimeError(f"Sortie modèle inattendue : shape={tuple(logits.shape)}")

    num_outputs = logits.shape[1]
    if len(CLASS_NAMES) != num_outputs:
        raise RuntimeError(
            f"Mismatch labels/modèle : {len(CLASS_NAMES)} labels vs {num_outputs} sorties modèle"
        )

except Exception as e:
    raise RuntimeError(f"Impossible de charger le modèle ou les labels : {e}")


def compute_orientation(predicted_class: str, confidence: float) -> str:
    # À adapter selon ta logique métier réelle
    if predicted_class in {
        "Melanoma",
        "Basal cell carcinoma",
        "Squamous cell carcinoma",
        "Actinic damage - premalignant keratinocytic lesions",
        "Cutaneous lymphoma - sarcoma",
    }:
        return "avis_medical_recommande"

    if confidence >= 80:
        return "surveillance"
    return "verification_medicale"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "num_classes": len(CLASS_NAMES),
        "device": str(device),
        "model_path": str(MODEL_PATH),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Fichier image invalide")

    try:
        content = await file.read()

        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Fichier vide")

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Image trop volumineuse")

        image = Image.open(io.BytesIO(content))
        image = ImageOps.exif_transpose(image).convert("RGB")

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Impossible de lire l'image")

    try:
        start = time.time()

        x = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            logits = model(x)
            probs = F.softmax(logits, dim=1)
            conf, pred = torch.max(probs, dim=1)

        elapsed_ms = int((time.time() - start) * 1000)

        predicted_index = int(pred.item())
        confidence = round(float(conf.item()) * 100, 2)
        predicted_class = CLASS_NAMES[predicted_index]

        topk = min(3, len(CLASS_NAMES))
        top_probs, top_indices = torch.topk(probs, k=topk, dim=1)

        top_predictions = []
        for p, idx in zip(top_probs[0], top_indices[0]):
            top_predictions.append({
                "classe": CLASS_NAMES[int(idx.item())],
                "score": round(float(p.item()) * 100, 2),
            })

        return {
            "classePredite": predicted_class,
            "scoreConfiance": confidence,
            "orientation": compute_orientation(predicted_class, confidence),
            "topPredictions": top_predictions,
            "modeleVersion": "efficientnet_b3_23classes_torchscript",
            "dureeInferenceMs": elapsed_ms,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'inférence: {str(e)}")