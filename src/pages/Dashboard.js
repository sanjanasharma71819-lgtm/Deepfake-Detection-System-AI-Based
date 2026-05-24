import React from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const scanResults = JSON.parse(localStorage.getItem("scanResults")) || [];

  const totalScans = scanResults.length;

  const fakeCount = scanResults.filter((r) => r.label === "FAKE").length;
  const realCount = scanResults.filter((r) => r.label === "REAL").length;

  const pieData = {
    labels: ["Fake", "Real"],
    datasets: [
      {
        data: [fakeCount, realCount],
        backgroundColor: ["#ff4b2b", "#28a745"],
      },
    ],
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>AI Deepfake Detection Dashboard</h1>
        <p>Monitor AI predictions in real-time</p>
      </div>

      {/* STATS */}
      <div className="overview-cards">
        <div className="card glass">
          <h2>{totalScans}</h2>
          <p>Total Scans</p>
        </div>

        <div className="card glass danger">
          <h2>{fakeCount}</h2>
          <p>Fake Detected</p>
        </div>

        <div className="card glass success">
          <h2>{realCount}</h2>
          <p>Real Media</p>
        </div>
      </div>

      {/* ALERT */}
      <div className="alert-box glass">
        <h3>
          {fakeCount > 0
            ? "⚠ Deepfake Content Detected!"
            : "✔ System Secure - No Fake Media Found"}
        </h3>
      </div>

      {/* CHART */}
      {totalScans > 0 && (
        <div className="charts-section">
          <div className="chart-box glass">
            <h3>Prediction Distribution</h3>
            <Pie data={pieData} />
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="quick-action glass">
        <h3>Quick Actions</h3>

        <div className="action-buttons">
          <button onClick={() => navigate("/upload")}>
            📁 Upload Media
          </button>

          <button onClick={() => navigate("/webcam")}>
            🎥 Live Webcam Scan
          </button>

          <button
            onClick={() => {
              const data =
                JSON.parse(localStorage.getItem("scanResults")) || [];

              const formatted = data
                .map(
                  (item, index) =>
                    `Scan ${index + 1}
Date: ${item.date}
File: ${item.file}
Result: ${item.label}
Confidence: ${(item.confidence * 100).toFixed(2)}%
----------------------`
                )
                .join("\n");

              const blob = new Blob([formatted], {
                type: "text/plain",
              });

              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "Deepfake_Report.txt";
              a.click();
            }}
          >
            📄 Download Report
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="activity-section glass">
        <h3>Recent Activity</h3>

        {totalScans === 0 ? (
          <p>No scans performed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>File</th>
                <th>Result</th>
                <th>Confidence</th>
              </tr>
            </thead>

            <tbody>
              {scanResults.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.file}</td>
                  <td
                    style={{
                      color:
                        item.label === "FAKE" ? "#ff4b2b" : "#28a745",
                      fontWeight: "bold",
                    }}
                  >
                    {item.label}
                  </td>
                  <td>{(item.confidence * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BACK BUTTON */}
      <button className="floating-btn" onClick={() => navigate(-1)}>
        ⬅
      </button>
    </div>
  );
};

export default Dashboard;