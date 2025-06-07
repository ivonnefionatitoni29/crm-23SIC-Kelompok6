import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeUser = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const navigate = useNavigate();

  const handleReservasiClick = () => {
    setShowReservasiMenu(!showReservasiMenu);
  };

  const goToPage = (path) => {
    navigate(path);
  };

  // Dummy data poin loyalitas (nanti bisa diambil dari backend)
  const userPoints = 150;
  const loyaltyLevel = userPoints >= 200 ? 'Gold' : userPoints >= 100 ? 'Silver' : 'Bronze';

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Beranda</a>
            <a href="#layanan" className="hover:underline">Layanan</a>
            <a href="#faq" className="hover:underline">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Selamat Datang di Groovy VetCare</h2>
          <p className="text-lg mb-6">Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami.</p>
          <button onClick={() => goToPage('/login')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Buat Janji
          </button>
        </div>
      </section>

      {/* Info Loyalitas */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold">Poin Loyalitas Kamu</h3>
          <p className="text-lg mt-2">Total Poin: <span className="font-semibold text-green-600">{userPoints}</span></p>
          <p className="mt-1">Status: <span className="font-semibold">{loyaltyLevel}</span></p>
        </div>
      </section>

      {/* Layanan */}
      <section id="layanan" className="py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Layanan Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Pembelian */}
            <div onClick={() => goToPage('/jualbeli')} className="bg-white shadow rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition">
              <h4 className="font-semibold mb-2">Pembelian Obat & Makanan</h4>
              <p>Dapatkan produk terbaik untuk hewan kesayanganmu.</p>
            </div>

            {/* Reservasi */}
            <div className="bg-white shadow rounded-lg p-6 text-center relative">
              <h4
                className="font-semibold mb-2 cursor-pointer"
                onClick={handleReservasiClick}
              >
                Reservasi Layanan ▼
              </h4>
              <p>Klik untuk memilih jenis layanan reservasi.</p>
              {showReservasiMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white border rounded shadow w-full z-10">
                  <button onClick={() => goToPage('/form-penitipan')} className="block w-full px-4 py-2 hover:bg-green-100 text-left">Penitipan Hewan</button>
                  <button onClick={() => goToPage('/form-kebiri')} className="block w-full px-4 py-2 hover:bg-green-100 text-left">Kebiri</button>
                  <button onClick={() => goToPage('/form-vaksinasi')} className="block w-full px-4 py-2 hover:bg-green-100 text-left">Vaksinasi</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-100 py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Pertanyaan Umum (FAQ)</h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h4 className="font-semibold">Apa saja jenis hewan yang bisa ditangani?</h4>
              <p>Kami melayani berbagai jenis hewan peliharaan seperti anjing, kucing, kelinci, dan hewan kecil lainnya.</p>
            </div>
            <div>
              <h4 className="font-semibold">Apakah bisa reservasi tanpa login?</h4>
              <p>Reservasi memerlukan akun agar data hewan dan layanan dapat tercatat dengan baik.</p>
            </div>
            <div>
              <h4 className="font-semibold">Apakah tersedia layanan darurat?</h4>
              <p>Saat ini layanan darurat tersedia khusus untuk pelanggan loyal. Hubungi kami untuk info lebih lanjut.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-6">
        <p>&copy; 2025 Groovy VetCare. All rights reserved.</p>
        <p className="text-sm mt-2">Kontak: 08xx-xxxx-xxxx | Jl. Kesehatan No.123</p>
      </footer>
    </div>
  );
};

export default HomeUser;
