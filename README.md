# 🛡️ DeepShield AI — Deepfake Detection System

An AI-powered full-stack web application that detects deepfake images and videos using a dual-model ensemble (SimpleCNN + EfficientNet-B0) with Grad-CAM explainability.

---

## 📖 Table of Contents
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Model Architecture](#-model-architecture)
- [Challenges & Solutions](#-challenges--solutions)
- [Limitations & Future Improvements](#-limitations--future-improvements)
- [License](#-license)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 **Dual-model ensemble** | Custom CNN + pre-trained EfficientNet-B0 with soft-voting for robust predictions |
| 🖼️ **Image detection** | Upload any JPG/PNG/WEBP for instant analysis |
| 🎥 **Video detection** | Intelligently extracts 5 evenly-spaced frames and averages predictions |
| 🔥 **Grad-CAM heatmap** | Visual explanation of which facial regions drove the AI's decision |
| 📸 **Live webcam scan** | Capture a frame directly from your camera for real-time analysis |
| 📊 **Dashboard** | Track scan history with an interactive Pie Chart and downloadable reports |
| 🔐 **Google Auth** | Firebase authentication securing protected routes |

---

## ⚙️ How It Works

1. **User Upload**: A logged-in user uploads an image or video (or takes a webcam photo).
2. **Data Transmission**: React sends the file to the FastAPI backend using `multipart/form-data`.
3. **Preprocessing**:
   - *Images* are resized to 224x224 and normalized.
   - *Videos* are processed using OpenCV to mathematically extract 5 representative frames evenly spaced across the timeline.
4. **ML Inference**: Each frame is passed through two parallel PyTorch models (SimpleCNN and EfficientNet).
5. **Soft-Voting Ensemble**: The backend averages the mathematical probabilities from both models. The highest average determines the final `FAKE` or `REAL` verdict.
6. **Explainability**: If an image is analyzed, Grad-CAM is applied to generate a visual heatmap overlay, highlighting image regions that contributed to the prediction.
7. **Result Delivery**: The JSON verdict and Base64 heatmap are returned to React and displayed to the user.

---

## 🏗️ Tech Stack

### Frontend
- **React** (Create React App) & **React Router v7**
- **Firebase Auth** (Google Sign-In)
- **Chart.js / react-chartjs-2** (Dashboard charts)
- **react-webcam** (Live capture)

### Backend
- **FastAPI** (Python REST API) & **Uvicorn** (ASGI server)
- **PyTorch + timm** (Model inference & Transfer Learning)
- **OpenCV** (Video frame extraction & Grad-CAM)

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

Open a terminal in the project root:

```bash
cd deepfake-backend
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`.*

### 3. Frontend Setup

Open a **new terminal window** in the project root:

```bash
cd frontend
npm install
npm start
```
*The React app will automatically open at `http://localhost:3004` (or `3000` depending on configuration).*

> **🔑 Environment Variables Note**: You must create a `.env` file in the `frontend/` directory (using `.env.example` as a guide) to configure Firebase and the backend API URL. Ensure `.env` files are never committed to GitHub.

---

## 🧠 Model Architecture

- **SimpleCNN**: A custom 3-layer Convolutional Neural Network built from scratch. Learns dataset-specific patterns (blurriness, blending boundaries).
- **EfficientNet-B0**: A pre-trained model used with transfer learning for highly complex, high-level feature extraction.
- **Ensemble (Soft Voting)**: Instead of simple majority rules (hard voting), the probability outputs of the SimpleCNN and EfficientNet models are averaged to produce the final prediction.

---

## 💡 Challenges & Solutions

- **Video Processing Overhead**: Processing every frame of a 30fps video would crash a web server or take several minutes.
  - *Solution*: Used OpenCV to dynamically calculate the video length and extract exactly 5 evenly-spaced frames, which reduces the amount of video data processed.
- **Cross-Origin Resource Sharing (CORS)**: The frontend (React) and backend (FastAPI) run on different ports, causing the browser to block API requests by default.
  - *Solution*: Implemented FastAPI `CORSMiddleware` with strictly defined allowed origins via environment variables, ensuring secure and seamless communication.
- **Orphaned Temporary Files**: Processing heavy `multipart/form-data` uploads directly in memory is dangerous, but saving them to disk risks filling up server storage if the ML inference crashes.
  - *Solution*: Implemented Python `try/finally` blocks to guarantee that temporary video/image files are deleted from the disk immediately after inference, regardless of server errors.

---

## 🚧 Limitations & Future Improvements

### Current Limitations
- **No Temporal Analysis**: The system analyzes video frames independently. It does not evaluate temporal inconsistencies (e.g., unnatural blinking or mismatched audio-lip synchronization).
- **Background Noise**: The models currently analyze the entire image frame, meaning background artifacts can occasionally influence the prediction.

### Future Improvements
- **Face Cropping (MTCNN/MediaPipe)**: Integrate a pre-processing step to isolate and crop faces before feeding them to the models, removing background noise and improving accuracy.
- **ONNX Optimization**: Convert the PyTorch `.pth` model weights to ONNX format. This would drastically speed up CPU inference times when deployed on free-tier cloud servers.
- **Sequence Models**: Implement an LSTM or Vision Transformer (ViT) layer to evaluate the chronological sequence of video frames for more robust deepfake video detection.

---

## 📄 License

© 2026 Sanjana Sharma. All Rights Reserved.

This project is available for viewing and evaluation purposes. No permission is granted to copy, modify, distribute, or reuse the source code without prior written permission.
