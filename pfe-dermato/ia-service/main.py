from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
from PIL import Image, ImageOps
from pathlib import Path
from torchvision import transforms
import torch
import torch.nn.functional as F
import base64
import io
import json
import time

app = FastAPI(title="DermaScan IA Service")

# ================= PATHS =================
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "efficientnet_b3_dermato_23classes_enriched_mobile.pt"
LABELS_PATH = BASE_DIR / "labels.json"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB

# ================= SCHEMAS =================
class QualiteRequest(BaseModel):
    image: str  # base64

class PredictRequest(BaseModel):
    image: str  # base64

# ================= PREPROCESSING =================
TRANSFORM = transforms.Compose([
    transforms.Resize((320, 320)),
    transforms.CenterCrop(300),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

# ================= LABELS =================
def load_labels(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        try:
            return [data[str(i)] for i in range(len(data))]
        except Exception as e:
            raise RuntimeError(f"labels.json invalide: {e}")

    raise RuntimeError("labels.json doit être une liste ou un dict indexé par string.")

# ================= MODEL =================
def load_model():
    model = torch.jit.load(str(MODEL_PATH), map_location=DEVICE)
    model.eval()
    return model

try:
    CLASS_NAMES = load_labels(LABELS_PATH)
    MODEL = load_model()

    with torch.no_grad():
        dummy = torch.zeros(1, 3, 300, 300, device=DEVICE)
        logits = MODEL(dummy)

    if logits.ndim != 2:
        raise RuntimeError(f"Sortie modèle inattendue: shape={tuple(logits.shape)}")

    num_outputs = logits.shape[1]
    if len(CLASS_NAMES) != num_outputs:
        raise RuntimeError(
            f"Mismatch labels/modèle: {len(CLASS_NAMES)} labels vs {num_outputs} sorties"
        )

    print(f"✅ Modèle TorchScript chargé sur {DEVICE}")
    print(f"✅ Nombre de classes: {len(CLASS_NAMES)}")

except Exception as e:
    raise RuntimeError(f"Impossible de charger le modèle ou les labels: {e}")

# ================= HELPERS =================
def decode_base64_image(image_b64: str) -> Image.Image:
    try:
        image_bytes = base64.b64decode(image_b64)

        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Image vide")

        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Image trop volumineuse")

        image = Image.open(io.BytesIO(image_bytes))
        image = ImageOps.exif_transpose(image).convert("RGB")
        return image

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Image base64 invalide")

async def decode_uploaded_file(file: UploadFile) -> Image.Image:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Fichier image invalide")

    try:
        content = await file.read()

        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Fichier vide")

        if len(content) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=413, detail="Image trop volumineuse")

        image = Image.open(io.BytesIO(content))
        image = ImageOps.exif_transpose(image).convert("RGB")
        return image

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Impossible de lire l'image")

def evaluer_qualite(image: Image.Image) -> dict:
    import numpy as np
    from scipy.ndimage import convolve

    img_array = np.array(image.convert("RGB"))

    luminosite = float(img_array.mean() / 255 * 100)

    gray = np.mean(img_array, axis=2)
    laplacian = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])
    sharpness = float(convolve(gray, laplacian).var())
    nettete = min(100, sharpness / 50)

    mise_au_point = min(100, float(gray.std() / 128 * 100))

    qualite_ok = luminosite > 20 and nettete > 10 and mise_au_point > 15
    score_global = (luminosite + nettete + mise_au_point) / 3

    return {
        "nettete": round(nettete, 1),
        "luminosite": round(luminosite, 1),
        "mise_au_point": round(mise_au_point, 1),
        "score_global": round(score_global, 1),
        "qualite_ok": qualite_ok,
    }

def determiner_urgence(classe: str, score: float) -> str:
    classe_lower = classe.lower()

    urgents = [
        "melanoma",
        "basal cell carcinoma",
        "squamous cell carcinoma",
        "cutaneous lymphoma",
        "sarcoma",
    ]

    consulter = [
        "eczematous",
        "psoriasiform",
        "drug eruptions",
        "rosacea",
        "pigmentary",
    ]

    if any(x in classe_lower for x in urgents):
        return "urgence"

    if any(x in classe_lower for x in consulter):
        return "consulter"

    if score >= 80:
        return "rassurant"

    return "consulter"

def get_conseils(classe: str) -> str:
    classe_lower = classe.lower()

    if "melanoma" in classe_lower:
        return "Une consultation dermatologique rapide est fortement recommandée."
    if "basal cell carcinoma" in classe_lower or "squamous cell carcinoma" in classe_lower:
        return "Consultez un dermatologue pour une évaluation spécialisée."
    if "eczematous" in classe_lower:
        return "Hydratez la peau, évitez les irritants et consultez si les symptômes persistent."
    if "psoriasiform" in classe_lower:
        return "Surveillez l’évolution et consultez un dermatologue pour confirmation."
    if "acneiform" in classe_lower:
        return "Évitez de manipuler la lésion, nettoyez doucement la zone et surveillez l’évolution."

    return "Surveillez l’évolution de la lésion et consultez un professionnel de santé en cas de doute."

def run_inference(image: Image.Image) -> dict:
    start = time.time()
    x = TRANSFORM(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = MODEL(x)
        probs = F.softmax(logits, dim=1)[0]

    top_idx = probs.argmax().item()
    top_label = CLASS_NAMES[top_idx]
    top_score = float(probs[top_idx]) * 100

    topk = min(5, len(CLASS_NAMES))
    top_probs, top_indices = torch.topk(probs, k=topk)

    resultats = {
        CLASS_NAMES[int(i)]: round(float(p) * 100, 2)
        for i, p in zip(top_indices.tolist(), top_probs.tolist())
    }

    duree = int((time.time() - start) * 1000)

    return {
        "classe": top_label,
        "score": round(top_score, 2),
        "resultats": resultats,
        "conseils": get_conseils(top_label),
        "niveau_urgence": determiner_urgence(top_label, top_score),
        "modele_version": "efficientnet_b3_23classes_torchscript",
        "duree_ms": duree,
    }

# ================= ROUTES =================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "num_classes": len(CLASS_NAMES),
        "device": str(DEVICE),
        "model_path": str(MODEL_PATH),
    }

# -------- QUALITE --------
@app.post("/qualite")
def verifier_qualite(req: QualiteRequest):
    image = decode_base64_image(req.image)
    return evaluer_qualite(image)

@app.post("/qualite-file")
async def verifier_qualite_file(file: UploadFile = File(...)):
    image = await decode_uploaded_file(file)
    return evaluer_qualite(image)

# -------- PREDICT --------
@app.post("/predict")
def predict(req: PredictRequest):
    image = decode_base64_image(req.image)
    return run_inference(image)

@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    image = await decode_uploaded_file(file)
    return run_inference(image)