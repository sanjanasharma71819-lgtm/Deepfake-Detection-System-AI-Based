import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/History.css";

function History() {
  const navigate = useNavigate();

  // Sample history data
  const scans = [
    { id: 1, file: "video1.mp4", result: "FAKE", confidence: 87 },
    { id: 2, file: "image1.jpg", result: "REAL", confidence: 95 },
    { id: 3, file: "video2.mp4", result: "FAKE", confidence: 80 },
  ];

  return (
    <div className="history-page">
      <h2>Scan History</h2>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Result</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id}>
              <td>{scan.file}</td>
              <td className={scan.result === "FAKE" ? "fake" : "real"}>
                {scan.result}
              </td>
              <td>{scan.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default History;