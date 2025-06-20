import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/homeuser");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow mb-2 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            Groovy Vetcare
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-grow md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-700 leading-tight">
            Merawat Hewan Kesayangan
            <br />
            Dengan Kasih & Profesionalisme
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Groovy Petcare bukan hanya klinik, tapi rumah kedua bagi hewan Anda.
            Kami menyediakan layanan lengkap: mulai dari vaksinasi, konsultasi,
            hingga penitipan dengan fasilitas modern dan tenaga ahli
            berpengalaman.
          </p>
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-3 px-7 py-4 bg-blue-600 text-white text-lg rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Masuk ke Home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        <div className="md:w-1/2">
          <img
            src="https://i.pinimg.com/736x/2c/77/87/2c77876f0e2bf947a07f4d1d376531e2.jpg"
            alt="Klinik Hewan"
            className="rounded-3xl shadow-2xl w-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Footer */}
      <footer class="bg-blue-700 text-white text-center py-6">
        <p class="text-sm">&copy; 2025 Groovy Petcare. All rights reserved.</p>
      </footer>
    </div>
  );
}
