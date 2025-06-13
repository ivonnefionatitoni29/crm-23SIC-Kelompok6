import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } else if (username === "user" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      navigate("/homeuserlogin");
    } else {
      alert("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-green-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-green-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mt-2">Silakan login untuk melanjutkan</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Masuk
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center">
          &copy; 2025 Groovy VetCare. All rights reserved.
        </p>
      </div>
    </div>
  );
}
