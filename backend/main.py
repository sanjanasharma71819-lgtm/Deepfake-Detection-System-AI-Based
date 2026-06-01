from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from ml.compare import compare_models

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://deepfake-detection-system-ai-based-three.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"status": "backend running"}



@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return {
        "final_prediction": "REAL",
        "confidence": 0.99,
        "cnn_result": {
            "label": "REAL",
            "confidence": 0.99
        }
    }