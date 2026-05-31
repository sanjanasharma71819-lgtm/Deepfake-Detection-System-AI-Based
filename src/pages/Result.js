import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

 
  const result = state?.result || state || {};
  const label =
    result?.final_prediction ||
    result?.label ||
    "UNKNOWN";

  const confidence =
    result?.confidence ||
    0;

  const fileName =
    state?.file || state?.filename || "unknown";

  const isFake = label === "FAKE";


  useEffect(() => {
    if (!state) return;

    const existing =
      JSON.parse(localStorage.getItem("scanResults")) || [];

    const newEntry = {
      date: new Date().toLocaleString(),
      file: fileName,
      label: label,
      confidence: confidence,
    };

    existing.push(newEntry);

    localStorage.setItem(
      "scanResults",
      JSON.stringify(existing)
    );
  }, [state]);

  // If no data
  if (!state) {
    return (
      <div className="result-container">
        <h2>No Result Found</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="result-container">

      {loading ? (
        <div className="loading-box">
          <h2>🔍 AI Analyzing Media...</h2>
          <div className="loader"></div>
        </div>
      ) : (
        <div className="result-card">

          <h2>Analysis Complete</h2>

          {/* FINAL RESULT */}
          <div
            className="risk-badge"
            style={{
              background: isFake ? "#ff4b2b" : "#28a745",
            }}
          >
            {label} DETECTED
          </div>

          <p>
            Confidence: {(confidence * 100).toFixed(2)}%
          </p>

          <p>File: {fileName}</p>

          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>

        </div>
      )}
    </div>
  );
};

export default Result;