import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "../styles/AuthPage.css";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../firebase";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearMessages = () => {
    setError("");
    setInfo("");
  };

  // ── Forgot Password ────────────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Email / Password Login or Sign Up ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/home");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    clearMessages();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Human-readable Firebase error messages ────────────────────────────────
  const friendlyError = (code) => {
    const map = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential": "Invalid email or password. Please check and try again.",
      "auth/email-already-in-use": "An account already exists with this email.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/network-request-failed": "Network error. Check your internet connection.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  // ── Forgot Password View ───────────────────────────────────────────────────
  if (isForgot) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">🧠 DeepShield AI</div>
          <h2>Reset Password</h2>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
            Enter your email and we'll send a reset link.
          </p>

          {error && <div className="auth-error">{error}</div>}
          {info  && <div className="auth-info">{info}</div>}

          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <div
            className="toggle-link"
            onClick={() => { setIsForgot(false); clearMessages(); }}
          >
            ← Back to Login
          </div>
        </div>
      </div>
    );
  }

  // ── Main Login / Sign Up View ──────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🧠 DeepShield AI</div>

        <h2>{isLogin ? "Login" : "Create Account"}</h2>

        {error && <div className="auth-error">{error}</div>}
        {info  && <div className="auth-info">{info}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isLogin && (
            <div
              className="forgot"
              onClick={() => { setIsForgot(true); clearMessages(); }}
            >
              Forgot Password?
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div
          className="toggle-link"
          onClick={() => { setIsLogin(!isLogin); clearMessages(); }}
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