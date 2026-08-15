import React from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          AI Powered{" "}
          <span className="highlight">
            <Typewriter
              words={[
                "Deepfake Detection",
                "Media Authentication",
                "Digital Security",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
        </h1>

        <p>
          Protect your identity with cutting-edge artificial intelligence
          that detects manipulated images, videos & media in seconds.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/home")}>
            Explore Platform
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose DeepShield AI?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>⚡ Real-Time Detection</h3>
            <p>Instant AI analysis with high accuracy scoring.</p>
          </div>

          <div className="feature-card">
            <h3>🎥 Image & Video Scan</h3>
            <p>Supports multimedia & webcam detection.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Risk Analytics</h3>
            <p>Detailed reports with High / Medium / Low risk levels.</p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure & Private</h3>
            <p>Your uploaded data stays encrypted & protected.</p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div>
          <h2>10K+</h2>
          <p>Scans Completed</p>
        </div>
        <div>
          <h2>98%</h2>
          <p>Detection Accuracy</p>
        </div>
        <div>
          <h2>5K+</h2>
          <p>Active Users</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>

        <div className="steps">
          <div>
            <h3>1️⃣ Upload Media</h3>
            <p>Upload image or video for AI scanning.</p>
          </div>

          <div>
            <h3>2️⃣ AI Analysis</h3>
            <p>Advanced neural networks detect manipulation patterns.</p>
          </div>

          <div>
            <h3>3️⃣ View Results</h3>
            <p>Get detailed authenticity & risk report instantly.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;