import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

/**
 * ProtectedRoute
 * ──────────────
 * Wraps any route that requires the user to be authenticated.
 *
 * - While Firebase is resolving the auth state a lightweight spinner is shown
 *   so the page does not flash a redirect on first load.
 * - If the user is not signed in they are redirected to /login.
 * - Once authenticated the child element is rendered normally.
 *
 * Usage in App.js:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = "still loading"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null = not signed in, object = signed in
    });
    return () => unsubscribe();
  }, []);

  // Still determining auth state — show a minimal spinner
  if (user === undefined) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#aaa",
          fontSize: "1.1rem",
        }}
      >
        <span>🔐 Checking authentication…</span>
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Signed in → render the protected page
  return children;
};

export default ProtectedRoute;
