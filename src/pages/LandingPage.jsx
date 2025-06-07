import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/Dashboard"); 
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="bg-green-700 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Klinik Hewan Groovy Petcare</h1>
        </div>
      </header>

      <main className="flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto px-4 py-12 gap-8">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4 text-green-700">
            Merawat Hewan Peliharaan dengan Kasih Sayang
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Di Groovy Petcare, kami percaya bahwa hewan peliharaan bukan sekadar hewan —
            mereka adalah anggota keluarga. Dengan pengalaman dan dedikasi tinggi dalam 
            dunia kesehatan hewan, kami hadir untuk memberikan perawatan terbaik yang menyeluruh,
            penuh kasih sayang, dan profesional kepada hewan kesayangan Anda.
            <br />
            Kami menyediakan layanan lengkap mulai dari konsultasi kesehatan, vaksinasi,
            perawatan gigi, penitipan hewan, hingga produk perawatan berkualitas. 
            Didukung oleh tim dokter hewan berpengalaman dan fasilitas yang nyaman serta modern, 
            Groovy Petcare memastikan setiap kunjungan menjadi pengalaman yang aman dan menyenangkan 
            bagi hewan Anda.
          </p>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-800 transition"
          >
            Masuk ke Dashboard
          </button>
        </div>

        <div className="md:w-1/2">
          <img
            src="https://i.pinimg.com/736x/2c/77/87/2c77876f0e2bf947a07f4d1d376531e2.jpg"
            alt="Klinik Hewan"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </main>

      <footer className="bg-gray-100 text-center text-gray-500 py-4 text-sm">
        &copy; 2025 Groovy Petcare. All rights reserved.
      </footer>
    </div>
  );
}
