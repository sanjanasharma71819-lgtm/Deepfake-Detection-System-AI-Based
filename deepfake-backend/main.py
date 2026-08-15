from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import logging
from dotenv import load_dotenv

from ml.compare import compare_models
from ml.gradcam import generate_heatmap
from models.frame_extractor import is_video_file, extract_representative_frames

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("deepfake-backend")

app = FastAPI(title="DeepShield AI Backend", version="2.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
origins_env = os.getenv("ALLOWED_ORIGINS")
if origins_env:
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    origins = [
         "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
        "http://localhost:3004",
        "https://deepfake-detection-system-ai-based-ten.vercel.app",
        "https://deepfake-detection-system-ai-based-three.vercel.app",
    ]

logger.info(f"Configured CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/")
def home():
    logger.info("Root / endpoint visited")
    return {"status": "DeepShield AI backend running", "version": "2.0.0"}


# ── /predict ──────────────────────────────────────────────────────────────────
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an image or video file and return a deepfake prediction.

    - Images: analysed directly with the CNN + EfficientNet ensemble.
    - Videos: 5 evenly-spaced frames are extracted; each frame is analysed
              and the per-frame probabilities are averaged into a final verdict.
    """
    logger.info(f"Predict request received: {file.filename}")
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        # Save upload to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ── Video path ──────────────────────────────────────────────────────
        if is_video_file(file_path):
            logger.info(f"Detected video file: {file.filename}")
            frames = extract_representative_frames(file_path, n=5)

            # Run ensemble on each frame
            frame_results = []
            for i, pil_frame in enumerate(frames):
                # Save frame temporarily as JPEG
                frame_path = os.path.join(UPLOAD_DIR, f"_frame_{i}_{file.filename}.jpg")
                try:
                    pil_frame.save(frame_path, "JPEG")
                    result = compare_models(frame_path)
                    frame_results.append(result)
                finally:
                    if os.path.exists(frame_path):
                        os.remove(frame_path)

            if not frame_results:
                return JSONResponse(
                    status_code=422,
                    content={"error": "No frames could be analysed from the video"}
                )

            # Average probabilities across frames for the final verdict
            n_frames = len(frame_results)
            avg_real = sum(
                1 - r["confidence"] if r["final_prediction"] == "FAKE" else r["confidence"]
                for r in frame_results
            ) / n_frames

            # Use raw per-model confidence for model breakdown averages
            avg_cnn_confidence = sum(r["cnn_result"]["confidence"] for r in frame_results) / n_frames
            avg_effnet_confidence = sum(r["effnet_result"]["confidence"] for r in frame_results) / n_frames

            # Majority vote for per-model labels
            cnn_fake_votes = sum(1 for r in frame_results if r["cnn_result"]["label"] == "FAKE")
            effnet_fake_votes = sum(1 for r in frame_results if r["effnet_result"]["label"] == "FAKE")

            # Final ensemble verdict
            fake_frame_count = sum(1 for r in frame_results if r["final_prediction"] == "FAKE")
            final_label = "FAKE" if fake_frame_count > n_frames / 2 else "REAL"
            final_confidence = round(
                sum(
                    r["confidence"] if r["final_prediction"] == final_label else 1 - r["confidence"]
                    for r in frame_results
                ) / n_frames,
                4,
            )

            result = {
                "final_prediction": final_label,
                "confidence": final_confidence,
                "ensemble_method": "soft_voting",
                "frames_analysed": n_frames,
                "cnn_result": {
                    "label": "FAKE" if cnn_fake_votes > n_frames / 2 else "REAL",
                    "confidence": round(avg_cnn_confidence, 4),
                },
                "effnet_result": {
                    "label": "FAKE" if effnet_fake_votes > n_frames / 2 else "REAL",
                    "confidence": round(avg_effnet_confidence, 4),
                },
            }

            logger.info(f"Video prediction done for {file.filename}: {result['final_prediction']} ({n_frames} frames)")
            return result

        # ── Image path ──────────────────────────────────────────────────────
        else:
            result = compare_models(file_path)
            logger.info(f"Image prediction done for {file.filename}: {result}")
            return result

    except Exception as e:
        logger.error(f"Prediction failed for {file.filename}: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "backend crashed", "details": str(e)},
        )

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# ── /heatmap ──────────────────────────────────────────────────────────────────
@app.post("/heatmap")
async def heatmap(file: UploadFile = File(...)):
    """
    Generate a Grad-CAM heatmap overlay for an uploaded image.
    Returns JSON: { "heatmap": "data:image/png;base64,..." }

    Note: Only images are supported for heatmap generation (not videos).
    """
    logger.info(f"Heatmap request received: {file.filename}")
    file_path = os.path.join(UPLOAD_DIR, f"hm_{file.filename}")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if is_video_file(file_path):
            return JSONResponse(
                status_code=422,
                content={"error": "Heatmap is only supported for image files, not videos."}
            )

        heatmap_b64 = generate_heatmap(file_path)
        logger.info(f"Heatmap generated successfully for {file.filename}")
        return {"heatmap": heatmap_b64}

    except Exception as e:
        logger.error(f"Heatmap generation failed for {file.filename}: {e}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Heatmap generation failed", "details": str(e)},
        )

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)