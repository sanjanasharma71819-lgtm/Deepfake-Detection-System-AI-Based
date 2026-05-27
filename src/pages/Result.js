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


  useEffect(() => {
    if (!state) return;

    const existing =
      JSON.parse(localStorage.getItem("scanResults")) || [];

    const newEntry = {
      date: new Date().toLocaleString(),
      file: state.filename || "unknown",
      label: state.final?.label || "UNKNOWN",
      confidence: state.final?.confidence || 0,
    };

    existing.push(newEntry);

    localStorage.setItem(
      "scanResults",
      JSON.stringify(existing)
    );
  }, [state]);

 
  if (!state) {
    return (
      <div className="result-container">
        <h2>No Result Found</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const isFake = state.final?.label === "FAKE";

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
            {state.final?.label} DETECTED
          </div>

          <p>
            Confidence:{" "}
            {((state.final?.confidence || 0) * 100).toFixed(2)}%
          </p>

          <p>File: {state.filename}</p>

          {/* CNN */}
          <div className="model-box">
            <h3>CNN Model</h3>
            <p>{state.cnn?.label}</p>
            <p>
              {((state.cnn?.confidence || 0) * 100).toFixed(2)}%
            </p>
          </div>

          

          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>

        </div>
      )}
    </div>
  );
};

export default Result;