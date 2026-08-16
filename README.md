# 🛡️ DeepShield AI — Deepfake Detection System

An AI-powered full-stack web application that detects deepfake images and videos using a dual-model ensemble (SimpleCNN + EfficientNet-B0) with Grad-CAM explainability.

---

## 📖 Table of Contents
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Model Architecture](#-model-architecture)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Challenges & Solutions](#-challenges--solutions)
- [Limitations & Future Improvements](#-limitations--future-improvements)
- [License](#-license)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 **Dual-model ensemble** | Custom SimpleCNN + pre-trained EfficientNet-B0 with soft-voting |
| 🖼️ **Image detection** | Upload any JPG/PNG/WEBP for analysis |
| 🎥 **Video detection** | Extracts 5 evenly-spaced frames and averages predictions across them |
| 🔥 **Grad-CAM heatmap** | Highlights image regions that contributed most to the model's prediction |
| 📸 **Live webcam scan** | Capture a frame from your camera and submit it for analysis |
| 📊 **Dashboard** | Track scan history with a Pie Chart and downloadable text report |
| 🔐 **Firebase Auth** | Google Sign-In securing all protected routes |

---

## ⚙️ How It Works

1. **User Upload**: A logged-in user uploads an image or video, or captures a webcam frame.
2. **Data Transmission**: React sends the file to the FastAPI backend as `multipart/form-data`.
3. **Preprocessing**:
   - *Images* are resized to 224×224 pixels and converted to a PyTorch tensor.
   - *Videos* are opened with OpenCV; 5 evenly-spaced frame indices are calculated from the total frame count, and each selected frame is decoded and converted to a PIL Image.
4. **ML Inference**: Each image (or each extracted frame) is passed through SimpleCNN and EfficientNet-B0 independently. Both models apply `torch.softmax` to produce a `[real_prob, fake_prob]` probability array.
5. **Soft-Voting Ensemble**: The softmax probability arrays from both models are averaged element-wise. The class with the higher average probability is the final verdict (`FAKE` or `REAL`).
6. **Grad-CAM (images only)**: Forward and backward hooks are registered on the last convolutional layer of SimpleCNN. Gradients of the predicted class score with respect to that layer's feature maps are pooled and used to weight the feature maps, producing a heatmap that highlights regions contributing to the prediction. This is overlaid on the original image and returned as a Base64-encoded PNG.
7. **Result Delivery**: The JSON response (label, confidence, per-model breakdown) is returned to React and displayed on the Result page.

---

## 🏗️ Tech Stack

### Frontend
- **React 19** (Create React App) & **React Router v7**
- **Firebase Auth** (Google Sign-In)
- **Chart.js / react-chartjs-2** (Dashboard pie chart)
- **react-webcam** (Live webcam capture)
- **react-simple-typewriter** (Landing page hero text)
- **react-icons** (UI icons)

### Backend
- **FastAPI** & **Uvicorn** (Python REST API / ASGI server)
- **PyTorch** + **timm** (Model inference & transfer learning)
- **OpenCV** (`opencv-python-headless`) (Video frame extraction & Grad-CAM overlay)
- **Pillow** (Image loading)
- **python-dotenv** (Environment variable management)

---

## 📁 Project Structure

```
Deepfake-Detection-System-AI-Based/
│
├── frontend/                        # React (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProgressBar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── AuthPage.js
│   │   │   ├── Contact.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Heatmap.js
│   │   │   ├── History.js
│   │   │   ├── HomePage.js
│   │   │   ├── Landing.js
│   │   │   ├── Result.js
│   │   │   ├── Upload.js
│   │   │   └── Webcam.js
│   │   ├── styles/
│   │   ├── firebase.js
│   │   └── App.js
│   ├── .env.example
│   └── package.json
│
└── deepfake-backend/                # FastAPI
    ├── ml/
    │   ├── cnn_model.py             # SimpleCNN architecture
    │   ├── efficientnet_model.py    # EfficientNet-B0 architecture
    │   ├── predictor_cnn.py         # CNN inference
    │   ├── predictor_effnet.py      # EfficientNet inference
    │   ├── compare.py               # Soft-voting ensemble
    │   ├── gradcam.py               # Grad-CAM heatmap generation
    │   ├── data_loader.py
    │   ├── dataset.py
    │   ├── train_cnn.py
    │   └── train_efficientnet.py
    ├── models/
    │   ├── cnn.pth                  # Trained SimpleCNN weights
    │   ├── efficientnet.pth         # Fine-tuned EfficientNet-B0 weights
    │   └── frame_extractor.py       # OpenCV video frame extraction
    ├── uploads/                     # Temporary upload directory (auto-cleaned)
    ├── main.py                      # FastAPI app & endpoints
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- A [Firebase project](https://console.firebase.google.com/) with Google Sign-In enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/sanjanasharma71819-lgtm/Deepfake-Detection-System-AI-Based.git
cd Deepfake-Detection-System-AI-Based
```

### 2. Backend Setup

```bash
cd deepfake-backend
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

*The API will be available at `http://localhost:8000`.*

### 3. Frontend Setup

Open a **new terminal** in the project root:

```bash
cd frontend
cp .env.example .env      # then fill in your Firebase credentials
npm install
npm start
```

*The React app will open at `http://localhost:3004`.*

> **Environment variables**: Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase project credentials. Never commit `.env` to version control.

---

## 🧠 Model Architecture

- **SimpleCNN**: A custom 3-block Convolutional Neural Network built from scratch. Architecture: `Conv2d(3→32) → ReLU → MaxPool2d`, repeated with 32→64 and 64→128 channels, followed by a fully-connected head (`Linear(128×28×28, 128) → ReLU → Linear(128, 2)`). Trained on the project dataset; weights stored in `models/cnn.pth`.

- **EfficientNet-B0**: Loaded from `timm` with `pretrained=True` (ImageNet weights). The final classifier layer is replaced with `Linear(in_features, 2)` and the model is fine-tuned for binary deepfake classification. Weights stored in `models/efficientnet.pth`.

- **Ensemble (Soft Voting)**: Both models produce a softmax probability vector `[real_prob, fake_prob]`. The soft-voting ensemble averages these vectors element-wise across both models. The class with the higher average probability is the final prediction.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns server status and version |
| `POST` | `/predict` | Accepts an image or video file; returns label, confidence, and per-model breakdown |
| `POST` | `/heatmap` | Accepts an image file; returns a Base64-encoded Grad-CAM heatmap overlay (images only) |

**`POST /predict` response shape (image):**
```json
{
  "final_prediction": "FAKE",
  "confidence": 0.8741,
  "ensemble_method": "soft_voting",
  "cnn_result": { "label": "FAKE", "confidence": 0.91 },
  "effnet_result": { "label": "FAKE", "confidence": 0.84 }
}
```

**`POST /predict` response shape (video)** — same fields, plus:
```json
{
  "frames_analysed": 5
}
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Dev server port (set to `3004`) |
| `CI` | Set to `false` to prevent warnings from failing the build |
| `REACT_APP_API_URL` | Base URL of the FastAPI backend. Set to `http://localhost:8000` for local development. |
| `REACT_APP_FIREBASE_API_KEY` | Firebase project API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |

### Backend (`deepfake-backend/.env`)

| Variable | Description |
|---|---|
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins (e.g., your Vercel URL). If unset, a default list of `localhost` origins is used. |

---

## ☁️ Deployment

### Frontend → Vercel

The React frontend is deployed on [Vercel](https://vercel.com).

1. Connect the repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Add all `REACT_APP_*` environment variables in the Vercel project settings.

> **Note**: The Vercel deployment serves the React UI only. ML predictions (`/predict`, `/heatmap`) require the FastAPI backend to be running locally and accessible from the browser. The deployed frontend is not connected to a cloud backend.

### Backend — Local Only

The FastAPI backend is not deployed to a cloud service in the current setup. It runs locally alongside the frontend for end-to-end use:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3004`

See [Getting Started](#-getting-started) for setup instructions.

> **Optional**: The backend can be self-hosted on a platform such as [Render](https://render.com) (Root Directory: `deepfake-backend`, Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`). If deployed, update `REACT_APP_API_URL` in the Vercel environment variables to the hosted backend URL and set `ALLOWED_ORIGINS` on the backend to include your Vercel domain.

---

## 💡 Challenges & Solutions

- **Video Processing Overhead**: Processing every frame of a video at inference time is expensive and impractical for a web server.
  - *Solution*: OpenCV reads the total frame count and calculates evenly-spaced frame indices, so only 5 frames are ever decoded and passed to the models regardless of video length.

- **Cross-Origin Resource Sharing (CORS)**: The React frontend and FastAPI backend run on different origins, which browsers block by default.
  - *Solution*: FastAPI `CORSMiddleware` is configured with an explicit allowlist of origins read from the `ALLOWED_ORIGINS` environment variable.

- **Orphaned Temporary Files**: Uploaded files are saved to disk for inference. If the model crashes, files could accumulate indefinitely.
  - *Solution*: All file cleanup is performed in `try/finally` blocks in `main.py`, ensuring temporary files are deleted whether inference succeeds or fails.

---

## 🚧 Limitations & Future Improvements

### Current Limitations
- **No temporal analysis**: Video frames are analysed independently. The system does not evaluate temporal inconsistencies such as unnatural motion, blinking patterns, or audio-lip mismatches.
- **Full-frame analysis**: Both models analyse the entire image frame. Background content can influence the prediction alongside the subject's face.
- **CPU-only inference**: Models run on CPU, which increases response time for large files.

### Future Improvements
- **Face cropping (MTCNN / MediaPipe)**: Pre-process images to isolate and crop the face region before passing it to the models, reducing the influence of background content.
- **ONNX export**: Convert `.pth` weights to ONNX format for faster CPU inference on constrained deployment environments.
- **Sequence modelling**: Add an LSTM or Vision Transformer layer to model the temporal sequence of extracted video frames for improved video deepfake detection.

---

## 📄 License

© 2026 Sanjana Sharma. All Rights Reserved.

This project is available for viewing and evaluation purposes. No permission is granted to copy, modify, distribute, or reuse the source code without prior written permission.
