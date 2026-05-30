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

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://deepfake-detection-system-ai-based-77ze.onrender.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Backend Response:", data);

    if (!data || !data.final_prediction) {
      throw new Error("Invalid response from backend");
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

    navigate("/result", { state: data });

  } catch (error) {
    console.error("Upload Error:", error);
    alert("Backend connection failed or invalid response");
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