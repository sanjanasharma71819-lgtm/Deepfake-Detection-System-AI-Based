import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const [loading, setLoading]           = useState(true);
  const [heatmapSrc, setHeatmapSrc]     = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapError, setHeatmapError] = useState(null);

  // Simulate a brief "analyzing" delay for UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const label = state?.final?.label || state?.final_prediction || "UNKNOWN";
  const confidence = state?.final?.confidence || state?.confidence || 0;
  const fileName = state?.filename || state?.file || "unknown";

  const cnn          = state?.cnn    || null;
  const effnet       = state?.effnet || null;
  const ensembleMethod = state?.ensemble_method || null;
  const framesAnalysed = state?.frames_analysed || null;
  // The original File object is stored in state so we can send it to /heatmap
  const originalFile = state?.originalFile || null;

  const isFake = label === "FAKE";

  // Persist to localStorage (avoid duplicate if Upload.js already saved)
  useEffect(() => {
    if (!state) return;
    const existing = JSON.parse(localStorage.getItem("scanResults")) || [];
    const last = existing[0];
    if (last && last.file === fileName && last.label === label) return;
    existing.unshift({
      date: new Date().toLocaleString(),
      file: fileName,
      label,
      confidence,
    });
    localStorage.setItem("scanResults", JSON.stringify(existing));
  }, [state, fileName, label, confidence]);

  // ── Heatmap fetch ──────────────────────────────────────────────────────────
  const handleHeatmap = async () => {
    if (!originalFile) {
      setHeatmapError(
        "Heatmap requires the original file. Please upload again from the Upload page."
      );
      return;
    }

    setHeatmapLoading(true);
    setHeatmapError(null);

    try {
      const formData = new FormData();
      formData.append("file", originalFile);

      const apiBaseUrl =
        process.env.REACT_APP_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiBaseUrl}/heatmap`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (data.error) throw new Error(data.details || data.error);

      setHeatmapSrc(data.heatmap); // base64 data URI
    } catch (err) {
      console.error("Heatmap error:", err);
      setHeatmapError("⚠️ Could not generate heatmap: " + err.message);
    } finally {
      setHeatmapLoading(false);
    }
  };

  // ── Sub-component: per-model confidence bar ────────────────────────────────
  const ConfidenceBar = ({ modelName, result }) => {
    if (!result) return null;
    const pct = (result.confidence * 100).toFixed(1);
    const isMFake = result.label === "FAKE";
    return (
      <div className="model-card">
        <div className="model-card-header">
          <span className="model-name">{modelName}</span>
          <span
            className="model-badge"
            style={{ background: isMFake ? "#ff4b2b" : "#28a745" }}
          >
            {result.label}
          </span>
        </div>
        <div className="confidence-bar-track">
          <div
            className="confidence-bar-fill"
            style={{
              width: `${pct}%`,
              background: isMFake
                ? "linear-gradient(90deg, #ff6b35, #ff4b2b)"
                : "linear-gradient(90deg, #43c463, #28a745)",
            }}
          />
        </div>
        <span className="confidence-label">{pct}% confidence</span>
      </div>
    );
  };

  // ── No state guard ─────────────────────────────────────────────────────────
  if (!state) {
    return (
      <div className="result-container">
        <h2>No Result Found</h2>
        <button onClick={() => navigate("/upload")}>Go to Upload</button>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="result-container">
      {loading ? (
        <div className="loading-box">
          <h2>🔍 AI Analyzing Media...</h2>
          <div className="loader" />
        </div>
      ) : (
        <div className="result-card">

          <h2>Analysis Complete</h2>

          {/* Final verdict */}
          <div
            className="risk-badge"
            style={{
              background: isFake
                ? "linear-gradient(135deg, #ff4b2b, #c0392b)"
                : "linear-gradient(135deg, #28a745, #1e7e34)",
            }}
          >
            {isFake ? "⚠️" : "✅"} {label} DETECTED
          </div>

          <p className="confidence-text">
            Ensemble Confidence:{" "}
            <strong>{(confidence * 100).toFixed(2)}%</strong>
          </p>

          <p className="file-text">File: {fileName}</p>

          {framesAnalysed && (
            <p className="file-text" style={{ color: "#aaa", fontSize: "0.85rem" }}>
              🎞️ {framesAnalysed} video frames analysed
            </p>
          )}

          {/* Per-model breakdown */}
          {(cnn || effnet) && (
            <div className="model-breakdown">
              <h3>
                🤖 Model Breakdown
                {ensembleMethod && (
                  <span className="ensemble-tag">
                    {ensembleMethod.replace("_", " ")}
                  </span>
                )}
              </h3>
              <ConfidenceBar modelName="SimpleCNN"      result={cnn} />
              <ConfidenceBar modelName="EfficientNet-B0" result={effnet} />
            </div>
          )}

          {/* Grad-CAM Heatmap section (images only) */}
          {!framesAnalysed && (
            <div className="heatmap-section">
              <h3>🔥 Grad-CAM Heatmap</h3>
              <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
                Visualises which image regions influenced the AI decision.
              </p>

              {!heatmapSrc && (
                <button
                  className="heatmap-btn"
                  onClick={handleHeatmap}
                  disabled={heatmapLoading}
                >
                  {heatmapLoading ? "Generating..." : "🔬 Generate Heatmap"}
                </button>
              )}

              {heatmapError && (
                <p style={{ color: "#ff4b2b", marginTop: "8px", fontSize: "0.85rem" }}>
                  {heatmapError}
                </p>
              )}

              {heatmapSrc && (
                <div className="heatmap-result">
                  <img
                    src={heatmapSrc}
                    alt="Grad-CAM heatmap overlay"
                    className="heatmap-img"
                  />
                  <p style={{ color: "#aaa", fontSize: "0.78rem", marginTop: "6px" }}>
                    Red regions = strongest influence on the model's decision
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            className="dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>
      )}
    </div>
  );
};

export default Result;