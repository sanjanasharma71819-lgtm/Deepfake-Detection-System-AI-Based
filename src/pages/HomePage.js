import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import "../styles/HomePage.css";


const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  if (location.hash) {
    const element = document.getElementById(location.hash.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
}, [location]);
  return (
    
  <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        
        
      </nav>
      

      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>AI-Powered Deepfake Detection System</h1>
        <div className="hero-box">
          <p>
            Our system analyzes images and videos using advanced AI models 
            to detect manipulation, facial inconsistencies, and synthetic media patterns.
          </p>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="feature-section">

        <div className="feature-card" onClick={() => navigate("/upload")}>
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048943.png" alt="AI Scan" />
          <h3>AI Media Analysis</h3>
          <p>Detect deepfake images and videos with high accuracy.</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/dashboard")}>
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Dashboard" />
          <h3>Risk Dashboard</h3>
          <p>Visual insights with charts & risk level classification.</p>
        </div>

        <div className="feature-card">
          <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" alt="Security" />
          <h3>Secure & Reliable</h3>
          <p>AI highlights manipulated regions & anomaly patterns.</p>
        </div>

      </div>
      {/* HOW IT WORKS */}
<div className="how-section">
  <h2>How DeepShield AI Works</h2>

  <div className="how-cards">

    <div className="how-card">
      <img src="https://cdn-icons-png.flaticon.com/512/3063/3063821.png" alt="Upload"/>
      <h4>Upload Media</h4>
      <p>User uploads image or video for analysis.</p>
    </div>

    <div className="how-card">
      <img src="https://cdn-icons-png.flaticon.com/512/4149/4149676.png" alt="AI Scan"/>
      <h4>AI Analysis</h4>
      <p>Model checks facial landmarks & manipulation artifacts.</p>
    </div>

    <div className="how-card">
      <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Result"/>
      <h4>Risk Result</h4>
      <p>System generates High / Medium / Low risk report.</p>
    </div>

  </div>
</div>

{/* FAQ SECTION */}
<div className="faq-section">
  <h2>Frequently Asked Questions</h2>

  <div className="faq-item">
    <h4>What is Deepfake?</h4>
    <p>Deepfake is AI-generated synthetic media that manipulates real faces or voices.</p>
  </div>

  <div className="faq-item">
    <h4>Is the detection accurate?</h4>
    <p>Our AI uses pattern recognition & anomaly detection for high accuracy.</p>
  </div>
</div>

{/* CONTACT SECTION */}
<div className="contact-section">
  <h2>Contact Us</h2>

  
</div>
<div className="footer-social">

  <a 
    href="https://www.instagram.com/" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <i className="fab fa-instagram"></i>
  </a>

  <a 
    href="https://www.linkedin.com/" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <i className="fab fa-linkedin"></i>
  </a>

  <a 
    href="https://twitter.com/" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <i className="fab fa-twitter"></i>
  </a>

  <a 
    href="mailto:support@deepshieldai.com"
  >
    <i className="fas fa-envelope"></i>
  </a>

</div>


    </div>
  );
};

export default HomePage;