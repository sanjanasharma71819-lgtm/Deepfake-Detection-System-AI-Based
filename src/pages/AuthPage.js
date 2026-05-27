import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "../styles/AuthPage.css";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, provider } from "../firebase";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

 

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🧠 DeepShield AI</div>

        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" required />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input type="password" placeholder="Password" required />

          {isLogin && (
            <div
              className="forgot"
              onClick={handleForgotPassword}
              style={{ cursor: "pointer" }}
            >
              Forgot Password?
            </div>
          )}

          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            margin: "15px 0",
            color: "#aaa",
          }}
        >
          OR
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div
          className="toggle-link"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;