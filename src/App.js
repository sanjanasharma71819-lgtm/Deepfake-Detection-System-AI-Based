import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import Webcam from "./pages/Webcam";




function App() {
  return (
    <Router>
     
      {/* Navbar*/}
      <Navbar/>

      <Routes>

        {/*FIRST */}
        <Route path="/" element={<Landing />} />
        {/*HOME */}
        <Route path="/home" element={<HomePage />} />

        {/* AUTH */}
        <Route path="/login" element={<AuthPage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* UPLOAD */}
        <Route path="/upload" element={<Upload/>} />
        <Route path="/webcam" element={<Webcam />} />

        {/* RESULT */}
        <Route path="/result" element={<Result />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/webcam" element={<Webcam />} />

        
        

      </Routes>
    </Router>
  );
}

export default App;