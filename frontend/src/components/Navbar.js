import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Subscribe to Firebase auth state once
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="logo">DeepShield AI</div>

      <div className="nav-links">
        <Link className={isActive("/home")}      to="/home">Home</Link>
        <Link className={isActive("/dashboard")} to="/dashboard">Dashboard</Link>
        <Link className={isActive("/upload")}    to="/upload">Upload</Link>
        <Link className={isActive("/contact")}   to="/contact">Contact</Link>

        {user ? (
          /* Signed-in state — show user name + logout */
          <div className="nav-user">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="avatar"
                className="nav-avatar"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="nav-username">
              {user.displayName || user.email}
            </span>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          /* Signed-out state — show Login link */
          <Link
            className={`signin ${isActive("/login")}`}
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;