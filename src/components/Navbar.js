import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">DeepShield AI</div>

      <div className="nav-links">
        <Link className={location.pathname === "/home" ? "active" : ""} to="/home">Home</Link>
        <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">Dashboard</Link>
        <Link className={location.pathname === "/upload" ? "active" : ""} to="/upload">Upload</Link>
        <Link className={location.pathname === "/login" ? "active signin" : "signin"} to="/login">Login</Link>
        <Link className={location.pathname === "/contact" ? "active" : ""} to="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;