import React from "react";
import "../styles/ProgressBar.css";

function ProgressBar({ value }) {
  return (
    <div className="progress-container">
      <div className="progress-fill" style={{ width: `${value}%` }}></div>
    </div>
  );
}

export default ProgressBar;