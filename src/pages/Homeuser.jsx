import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeUser = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://bic.id/wp-content/uploads/2023/12/dokter-Hewan-Lulusan-Dari-Fakultas-Kedokteran-Hewan.webp",
    "https://cnc-magazine.oramiland.com/parenting/images/dokter-hewan-bandar-lampung.width-800.format-webp.webp",
    "https://bolumenara.co.id/uploads/8/2023-10/dokter_hewan.png",
  ];

  const handleReservasiClick = () => {
    setShowReservasiMenu(!showReservasiMenu);
  };

  const goToPage = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const userPoints = 150;
  const loyaltyLevel = userPoints >= 200 ? 'Gold' : userPoints >= 100 ? 'Silver' : 'Bronze';

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4 flex items-center">
            <a href="#" className="hover:underline">Beranda</a>
            <a href="#layanan" className="hover:underline">Layanan</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <button
              onClick={() => goToPage('/login')}
              className="ml-4 bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-green-100 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Image */}
      <section className="relative">
        <img
          src={images[currentSlide]}
          alt="Hero"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-4xl font-bold mb-2 text-center">Selamat Datang di Groovy VetCare</h2>
          <p className="text-lg mb-4 text-center max-w-xl">Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami.</p>
          <button onClick={() => goToPage('/login')} className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600 transition">
            Buat Janji
          </button>
        </div>
      </section>

      {/* Loyalty Info */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold">Poin Loyalitas Kamu</h3>
          <p className="text-lg">Total Poin: <span className="font-semibold text-green-600">{userPoints}</span></p>
          <p className="text-base">Status: <span className="font-semibold">{loyaltyLevel}</span></p>
        </div>
      </section>

      {/* Layanan Cards */}
      <section id="layanan" className="py-12 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Layanan Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Pembelian Produk */}
            <div
              onClick={() => goToPage('/jualbeli')}
              className="bg-white border hover:border-green-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2936/2936776.png" alt="Produk" className="w-20 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Pembelian Obat & Makanan</h4>
              <p className="text-sm text-gray-600">Dapatkan produk terbaik untuk hewan kesayanganmu.</p>
            </div>

            {/* Reservasi */}
            <div className="bg-white border hover:border-green-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition relative">
              <div
                onClick={handleReservasiClick}
                className="cursor-pointer text-center"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/7586/7586970.png" alt="Reservasi" className="w-20 mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Reservasi Layanan ▼</h4>
                <p className="text-sm text-gray-600">Klik untuk memilih jenis layanan reservasi.</p>
              </div>
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 bg-white border rounded shadow z-10 w-full text-left">
                  <button onClick={() => goToPage('/form-penitipan')} className="block w-full px-4 py-2 hover:bg-green-50">Penitipan Hewan</button>
                  <button onClick={() => goToPage('/form-kebiri')} className="block w-full px-4 py-2 hover:bg-green-50">Kebiri</button>
                  <button onClick={() => goToPage('/form-vaksinasi')} className="block w-full px-4 py-2 hover:bg-green-50">Vaksinasi</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-12">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-2xl font-bold text-center mb-8">Pertanyaan Umum (FAQ)</h3>
          <div className="space-y-6 text-left">
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
      <footer className="bg-gray-100 text-center py-6 text-sm">
        <p>&copy; 2025 Groovy VetCare. All rights reserved.</p>
        <p className="mt-1">Kontak: 08xx-xxxx-xxxx | Jl. Kesehatan No.123</p>
      </footer>
    </div>
  );
};

export default HomeUser;
