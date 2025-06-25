// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { supabase } from '../supabase'; // Import Supabase client
import CryptoJS from 'crypto-js'; // Import library hashing

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
      // PERINGATAN KRITIS: Membandingkan hash password di frontend SANGAT TIDAK AMAN.
      // Ini hanya untuk DEMONSTRASI. Dalam aplikasi nyata, perbandingan hash harus dilakukan di backend.
      const hashedPassword = CryptoJS.SHA256(password).toString();

      // 1. Ambil data pengguna dari tabel 'users' berdasarkan email
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password, role') // Ambil juga password yang tersimpan (hash) dan role
        .eq('email', email)
        .single(); // Harusnya hanya ada satu pengguna dengan email ini

      if (fetchError || !userData) {
        // Jika error atau pengguna tidak ditemukan
        alert("Login gagal: Email atau password salah.");
        console.error("Login Fetch Error:", fetchError);
        setLoading(false);
        return;
      }

      // 2. Bandingkan password yang dimasukkan (setelah di-hash) dengan password yang tersimpan
      if (hashedPassword === userData.password) {
        alert("Login berhasil!");
        // 3. Simpan status login dan role di localStorage atau context API
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userData.role); // Simpan peran pengguna
        localStorage.setItem("userId", userData.id); // Simpan peran pengguna

        // 4. Arahkan pengguna berdasarkan perannya
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
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700">Login</h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="form-checkbox text-blue-600 rounded mr-2" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Melakukan Login...' : 'Login'}
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Don't have an account? <a href="/RegisterPage" className="text-blue-600 font-semibold hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}