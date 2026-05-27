import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WebcamPage = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    setLoading(true);

    const res = await fetch(imageSrc);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append("file", blob, "webcam.jpg");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/webcam-predict/",
        formData
      );

      const result = response.data;

      const newResult = {
        date: new Date().toLocaleString(),
        file: "Webcam Capture",
        label: result.final.label,
        confidence: result.final.confidence,
      };

      const existing =
        JSON.parse(localStorage.getItem("scanResults")) || [];

      localStorage.setItem(
        "scanResults",
        JSON.stringify([newResult, ...existing])
      );

      navigate("/result", { state: result });

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    }

    setLoading(false);
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
        {loading ? "Analyzing..." : "Capture & Analyze"}
      </button>
    </div>
  );
};

export default WebcamPage;