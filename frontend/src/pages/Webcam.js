import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const WebcamPage = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);

    try {
      // Convert base64 data URI → Blob
      const res = await fetch(imageSrc);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "webcam.jpg");

      // Use the same env var as Upload.js — no hardcoded URLs
      const apiBaseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiBaseUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.details || data.error);
      }

      // Persist to scan history
      const existing =
        JSON.parse(localStorage.getItem("scanResults")) || [];
      existing.unshift({
        date: new Date().toLocaleString(),
        file: "Webcam Capture",
        label: data.final_prediction,   // fixed: was result.final.label
        confidence: data.confidence,
      });
      localStorage.setItem("scanResults", JSON.stringify(existing));

      // Navigate to result page with the correctly-shaped state
      navigate("/result", {
        state: {
          filename: "Webcam Capture",
          final: {
            label: data.final_prediction,
            confidence: data.confidence,
          },
          cnn: data.cnn_result,
          effnet: data.effnet_result,
          ensemble_method: data.ensemble_method,
        },
      });
    } catch (err) {
      console.error("Webcam prediction error:", err);
      alert("❌ Prediction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Live AI Webcam Detection</h2>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />

      <br /><br />

      <button onClick={capture} disabled={loading}>
        {loading ? "Analyzing..." : "📸 Capture & Analyze"}
      </button>
    </div>
  );
};

export default WebcamPage;