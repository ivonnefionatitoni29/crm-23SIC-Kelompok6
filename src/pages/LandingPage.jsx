import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/homeuser");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow mb-2 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            Groovy Vetcare
          </h1>
          <button
            onClick={handleLogin}
            className="px-5 py-2 bg-white text-blue-700 rounded-full font-semibold shadow hover:bg-blue-100 transition"
          >
            Masuk
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-700 leading-tight">
            Merawat Hewan Kesayangan<br />Dengan Kasih & Profesionalisme
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Groovy Petcare bukan hanya klinik, tapi rumah kedua bagi hewan Anda.
            Kami menyediakan layanan lengkap: mulai dari vaksinasi, konsultasi, hingga penitipan
            dengan fasilitas modern dan tenaga ahli berpengalaman.
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

      {/* Layanan Section */}
      <section className="bg-white py-20 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-blue-700 mb-10">Layanan Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {["Vaksinasi", "Konsultasi", "Penitipan Hewan"].map((service, idx) => (
              <div key={idx} className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
                <img
                  src="../src/assets/customer-service.png"
                  alt={service}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h4 className="text-xl font-semibold text-blue-800 mb-2">{service}</h4>
                <p className="text-sm text-gray-600">
                  Kami memberikan layanan {service.toLowerCase()} dengan penuh perhatian dan profesionalitas.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-blue-700 mb-10">Apa Kata Mereka?</h3>
          <div className="space-y-8">
            <blockquote className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-gray-700">"Pelayanan di Groovy sangat luar biasa. Dokternya sabar dan informatif!"</p>
              <footer className="mt-3 font-semibold text-blue-800">— Andi, pemilik kucing</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-xl shadow">
              <p className="italic text-gray-700">"Tempatnya bersih dan nyaman, hewan saya senang dirawat di sini."</p>
              <footer className="mt-3 font-semibold text-blue-800">— Siska, pemilik anjing</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6">
        <p className="text-sm">&copy; 2025 Groovy Petcare. All rights reserved.</p>
      </footer>
    </div>
  );
}
