import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(status);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-600 text-lg font-semibold">
        🔐 Mengecek sesi login...
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
}
