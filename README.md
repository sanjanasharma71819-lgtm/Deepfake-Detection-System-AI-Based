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

```powershell
cd frontend
npm install
npm start
```

The React app will open at `http://localhost:3004`.

---

## 🔑 Environment Variables

> **Note**: Environment files containing local configuration or secrets (e.g., `.env`) are **NOT committed** to Git. Use the provided `.env.example` as a template for your own secrets.

### Frontend (`frontend/.env`)
The local frontend uses `http://localhost:3004`.

| Variable | Description |
|---|---|
| `PORT` | The port the React app runs on (e.g., `3004`) |
| `REACT_APP_API_URL` | Backend URL (e.g., `http://localhost:8000`) |
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |

### Backend (`deepfake-backend/.env`)
The local backend uses `http://localhost:8000`.

| Variable | Description |
|---|---|
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins (controls FastAPI CORS) |

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

```text
Deepfake-Detection-System-AI-Based/
├── deepfake-backend/
│   ├── ml/
│   ├── models/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
├── .gitignore
├── .vercelignore
├── README.md
└── runtime.txt
```

---

## 🚢 Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |

- **Frontend**: Set `REACT_APP_API_URL` in Vercel to your deployed FastAPI backend URL.
- **Backend**: Set `ALLOWED_ORIGINS` on the backend to your deployed Vercel frontend URL so that CORS requests are permitted.

---

## 📄 License
MIT
