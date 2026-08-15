import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ["image/", "video/"];

    const isValid = validTypes.some((type) =>
      selectedFile.type.startsWith(type)
    );

    if (!isValid) {
      alert("Only Image or Video files allowed");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
  if (!file) {
    alert("Please select a file first");
    return;
  }

  setLoading(true);

  // Abort controller for a 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const response = await fetch(
      `${apiBaseUrl}/predict`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);
    if (data.error) {
      throw new Error(data.details || data.error);
    }

    const existing =
      JSON.parse(localStorage.getItem("scanResults")) || [];

    existing.unshift({
      date: new Date().toLocaleString(),
      file: file.name,
      label: data.final_prediction,
      confidence: data.confidence,
    });

    localStorage.setItem(
      "scanResults",
      JSON.stringify(existing)
    );

    navigate("/result", {
      state: {
        filename: file.name,
        final: {
          label: data.final_prediction,
          confidence: data.confidence,
        },
        cnn: data.cnn_result,
        effnet: data.effnet_result,
        ensemble_method: data.ensemble_method,
        frames_analysed: data.frames_analysed || null,
        originalFile: file,  // kept in memory so Result.js can call /heatmap
      },
    });

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Upload Error:", error);

    if (error.name === "AbortError") {
      alert(
        "⏱️ Request timed out!\n\n" +
        "The backend took too long to respond.\n" +
        "Make sure the backend server is running:\n\n" +
        "  cd deepfake-backend\n" +
        "  .\\venv\\Scripts\\python.exe -m uvicorn main:app --port 8000"
      );
    } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      alert(
        "🔌 Cannot connect to backend!\n\n" +
        "The backend server is not running or is unreachable.\n" +
        "Start it with:\n\n" +
        "  cd deepfake-backend\n" +
        "  .\\venv\\Scripts\\python.exe -m uvicorn main:app --port 8000"
      );
    } else {
      alert("❌ Analysis failed: " + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upload-wrapper">
      <div className="upload-card">

        <h1>AI Media Analysis</h1>
        <p>Upload image or video for deepfake detection</p>

        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >

          {!file ? (
            <>
              <p>📁 Drag & Drop or Click to Upload</p>

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  handleFile(e.target.files[0])
                }
              />
            </>
          ) : (
            <div className="preview">

              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                />
              ) : (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                />
              )}

              <p>{file.name}</p>

              <button
                className="remove-btn"
                onClick={() => setFile(null)}
              >
                Remove
              </button>

            </div>
          )}

        </div>

        <button
          className="analyze-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "🚀 Start AI Analysis"}
        </button>

        <div className="nav-buttons">

          <button onClick={() => navigate("/home")}>
            ← Home
          </button>

          <button onClick={() => navigate("/dashboard")}>
            📊 Dashboard
          </button>

        </div>

      </div>
    </div>
  );
};

export default Upload;