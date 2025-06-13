import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
  // validasi login
  if (username === "admin" && password === "1234") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    navigate("/dashboard"); // halaman admin
  } else if (username === "user" && password === "1234") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    navigate("/homeuserlogin"); // halaman user
  } else {
    alert("Username atau password salah!");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}
