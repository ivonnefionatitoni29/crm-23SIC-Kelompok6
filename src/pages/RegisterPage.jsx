// src/pages/RegisterPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { supabase } from '../supabase'; // Import Supabase client
import CryptoJS from 'crypto-js'; // Import library hashing

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Harap lengkapi semua bidang!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      // PERINGATAN KRITIS: Hashing password di frontend SANGAT TIDAK AMAN untuk produksi.
      // Ini hanya untuk DEMONSTRASI. Dalam aplikasi nyata, hashing harus dilakukan di backend.
      const hashedPassword = CryptoJS.SHA256(password).toString();

      // Cek apakah email sudah terdaftar untuk menghindari duplikasi
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError; // Rethrow actual errors
      }

      if (existingUser) {
        alert("Email sudah terdaftar. Silakan gunakan email lain atau login.");
        setLoading(false);
        return;
      }

      // 1. Masukkan data pengguna langsung ke tabel 'users' Anda
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            nama: username,
            email: email,
            password: hashedPassword, // <-- Password di-hash masuk ke kolom password
            // role dan loyalty_points akan menggunakan nilai DEFAULT dari skema tabel
          },
        ])
        .select() // Mengambil kembali data yang baru dimasukkan
        .single(); // Harusnya hanya satu data yang dimasukkan

      if (insertError) {
        alert("Pendaftaran gagal: " + insertError.message);
        console.error("Supabase Insert Error:", insertError);
      } else {
        alert("Pendaftaran berhasil! Silakan login.");
        console.log("User registered (custom):", data);
        navigate("/login");
      }

    } catch (error) {
      console.error("Unexpected error during registration:", error);
      alert("Terjadi kesalahan tak terduga. Silakan coba lagi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-700">Daftar</h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

          <div className="relative">
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <FaLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          Sudah punya akun? <a href="/login" className="text-blue-600 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}