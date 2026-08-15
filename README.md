# 🛡️ DeepShield AI — Deepfake Detection System

An AI-powered full-stack web application that detects deepfake images and videos using a dual-model ensemble (SimpleCNN + EfficientNet-B0) with Grad-CAM explainability.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 Dual-model ensemble | SimpleCNN + EfficientNet-B0 with soft-voting |
| 🖼️ Image detection | Upload any JPG/PNG/WEBP for instant analysis |
| 🎥 Video detection | Extracts 5 evenly-spaced frames, averages predictions |
| 🔥 Grad-CAM heatmap | Visual explanation of which regions drove the decision |
| 📸 Live webcam scan | Capture a frame directly from your camera |
| 📊 Dashboard | Pie chart, scan history, downloadable report |
| 🔐 Google Auth | Firebase authentication, protected routes |

---

## 🏗️ Tech Stack

### Frontend
- **React** (Create React App)
- **React Router v7** — client-side routing
- **Firebase Auth** — Google Sign-In
- **Chart.js / react-chartjs-2** — dashboard charts
- **react-simple-typewriter** — hero typewriter effect
- **react-webcam** — live webcam capture

### Backend
- **FastAPI** — Python REST API
- **PyTorch + timm** — model inference
- **OpenCV** — video frame extraction & Grad-CAM heatmap overlay
- **Uvicorn** — ASGI server

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- A [Firebase project](https://console.firebase.google.com) with Google Sign-In enabled

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/deepfake-detection-system.git
cd deepfake-detection-system
```

---

### 2. Backend setup

```bash
cd deepfake-backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Start the backend server:

```bash
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

---

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # then fill in your values
npm install
npm start
```

The React app will open at `http://localhost:3000`.

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend URL (e.g. `http://localhost:8000`) |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |

### Backend (`.env` in project root or `deepfake-backend/`)

| Variable | Description |
|---|---|
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/predict` | Analyse image or video — returns FAKE/REAL verdict |
| `POST` | `/heatmap` | Generate Grad-CAM heatmap for an image (returns base64 PNG) |

---

## 🧠 Model Architecture

### SimpleCNN
- 3 Conv blocks (32 → 64 → 128 channels), each followed by ReLU + MaxPool2d
- Fully connected classifier: 128×28×28 → 128 → 2

### EfficientNet-B0
- Pre-trained via `timm` with ImageNet weights
- Fine-tuned classifier head: `in_features → 2`

### Ensemble
- **Soft voting**: averages softmax probabilities from both models
- Final label = argmax of averaged real/fake probabilities

---

## 📂 Project Structure

```
deepfake-detection-system/
├── deepfake-backend/
│   ├── main.py                  # FastAPI app (predict + heatmap endpoints)
│   ├── requirements.txt
│   ├── ml/
│   │   ├── cnn_model.py         # SimpleCNN architecture
│   │   ├── efficientnet_model.py
│   │   ├── predictor_cnn.py     # Lazy-loading CNN inference
│   │   ├── predictor_effnet.py  # Lazy-loading EfficientNet inference
│   │   ├── compare.py           # Soft-voting ensemble logic
│   │   ├── gradcam.py           # Grad-CAM heatmap generation
│   │   ├── train_cnn.py         # CNN training script
│   │   └── train_efficientnet.py
│   └── models/
│       ├── cnn.pth              # Trained CNN weights
│       ├── efficientnet.pth     # Trained EfficientNet weights
│       └── frame_extractor.py  # Video → PIL frames (OpenCV)
│
└── frontend/
    ├── .env.example             # Template — copy to .env
    └── src/
        ├── App.js               # Router with protected routes
        ├── firebase.js          # Firebase config (reads from .env)
        ├── components/
        │   ├── Navbar.js        # Auth-aware navbar with logout
        │   └── ProtectedRoute.js
        └── pages/
            ├── Landing.js
            ├── HomePage.js
            ├── AuthPage.js
            ├── Upload.js
            ├── Result.js        # Verdict + Grad-CAM heatmap
            ├── Dashboard.js
            ├── Webcam.js
            └── Contact.js
```

---

## 🚢 Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) — set env vars in project settings |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |

Set `REACT_APP_API_URL` in Vercel to your deployed backend URL, and set `ALLOWED_ORIGINS` on the backend to your Vercel frontend URL.

---

## 📄 License
MIT
