// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { supabase } from '../supabase';
import CryptoJS from 'crypto-js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Harap lengkapi email dan password!");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password, role')
        .eq('email', email)
        .single();

      if (hashedPassword === userData.password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userId", userData.id);

        if (userData.role === 'admin') {
          navigate("/dashboard");
        } else {
          navigate("/homeuserlogin");
        }
      } else {
        alert("Login gagal: Email atau password salah.");
      }

    } catch (error) {
      console.error("Unexpected error during login:", error);
      alert("Terjadi kesalahan tak terduga. Silakan coba lagi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-blue-200 shadow-xl rounded-3xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-2">Welcome Back!</h2>
          <p className="text-gray-500">Silakan login untuk melanjutkan</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="form-checkbox text-blue-600 rounded mr-2" />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Lupa password?</a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl transition duration-200"
            disabled={loading}
          >
            {loading ? 'Melakukan Login...' : '🔐 Login'}
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{" "}
          <a href="/RegisterPage" className="text-blue-600 font-semibold hover:underline">
            Daftar Sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
