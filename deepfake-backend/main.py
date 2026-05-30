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

    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = compare_models(file_path)

        return result

    except Exception as e:
        return {
            "error": "backend crashed",
            "details": str(e)
        }