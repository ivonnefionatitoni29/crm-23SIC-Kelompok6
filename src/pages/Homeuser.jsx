import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import supabase instance

const HomeUser = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [showLayananMenu, setShowLayananMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://bic.id/wp-content/uploads/2023/12/dokter-Hewan-Lulusan-Dari-Fakultas-Kedokteran-Hewan.webp",
    "https://cnc-magazine.oramiland.com/parenting/images/dokter-hewan-bandar-lampung.width-800.format-webp.webp",
    "https://bolumenara.co.id/uploads/8/2023-10/dokter_hewan.png",
  ];

  const handleReservasiClick = () => setShowReservasiMenu(!showReservasiMenu);
  const handleLayananHeaderClick = () => setShowLayananMenu(!showLayananMenu);
  const goToPage = (path) => navigate(path);

  useEffect(() => {
    const slideInterval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % images.length),
      5000,
    );
    return () => clearInterval(slideInterval);
  }, []);

  // Masih disimpan jika nanti dibutuhkan saat user "sudah login"
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else navigate('/login');
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4 flex items-center">
            <a href="#" className="hover:underline">Beranda</a>
            <a href="/login" className="hover:underline">Pembelian Produk</a>

            {/* Dropdown Layanan */}
            <div className="relative">
              <button
                onClick={handleLayananHeaderClick}
                className="hover:underline flex items-center gap-1"
              >
                Layanan
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform duration-300 ${showLayananMenu ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showLayananMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20 animate-fade-down">
                  {['Penitipan Hewan', 'Kebiri', 'Vaksinasi'].map((layanan) => (
                    <button
                      key={layanan}
                      onClick={() => goToPage('/login')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      {layanan}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FAQ */}
            <a href="/faq-page" className="hover:underline">FAQ</a>

            {/* Login */}
            <button
              onClick={() => goToPage('/login')}
              className="ml-4 bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <img
          src={images[currentSlide]}
          alt="Hero"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
          <h2 className="text-4xl font-bold mb-2 text-center">Selamat Datang di Groovy VetCare</h2>
          <p className="text-lg mb-4 text-center max-w-xl">
            Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami.
          </p>
          <button
            onClick={() => goToPage('/login')}
            className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Buat Janji
          </button>
        </div>
      </section>

      {/* Prediksi Kesehatan Hewan */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://d2zp5xs5cp8zlg.cloudfront.net/image-43032-800.jpg"
              alt="Health Prediction"
              className="w-[18rem] md:w-[32rem] lg:w-[36rem] drop-shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-blue-700 mb-4 leading-snug">
              Prediksi Kesehatan Hewanmu
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Manfaatkan kecerdasan buatan (AI) untuk membantu mendiagnosis kondisi awal
              kesehatan hewan peliharaanmu. Jawab beberapa pertanyaan sederhana dan dapatkan
              hasil prediksi dalam hitungan detik!
            </p>
            <button
              onClick={() => goToPage('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-full font-semibold shadow-md transition"
            >
              🔍 Mulai Prediksi Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section id="layanan" className="py-12 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Layanan Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pembelian Produk */}
            <div
              onClick={() => goToPage('/login')}
              className="bg-white border hover:border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2936/2936776.png"
                alt="Produk"
                className="w-20 mb-4"
              />
              <h4 className="font-semibold text-lg mb-2">Pembelian Obat & Makanan</h4>
              <p className="text-sm text-gray-600">
                Dapatkan produk terbaik untuk hewan kesayanganmu.
              </p>
            </div>

            {/* Reservasi */}
            <div className="bg-white border hover:border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition relative">
              <div
                onClick={handleReservasiClick}
                className="cursor-pointer text-center flex flex-col items-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7586/7586970.png"
                  alt="Reservasi"
                  className="w-20 mb-3 transition-transform duration-300 hover:scale-105"
                />
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  Reservasi Layanan
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform duration-300 ${showReservasiMenu ? 'rotate-180' : 'rotate-0'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-sm text-gray-600">Klik untuk memilih jenis layanan reservasi.</p>
              </div>

              {showReservasiMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[90%] max-w-xs bg-white border border-blue-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  {['Penitipan Hewan', 'Kebiri', 'Vaksinasi'].map((layanan) => (
                    <button
                      key={layanan}
                      onClick={() => goToPage('/login')}
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    >
                      {layanan}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-10 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Kontak & Alamat */}
          <div>
            <h3 className="text-xl font-bold mb-3">Groovy Vetcare Clinic</h3>
            <p className="mb-1">Ruko Galeri Niaga No. 9F-G</p>
            <p className="mb-1">Jl. Haji Nawi Raya, Kel. Gandaria Selatan,</p>
            <p className="mb-2">Kec. Cilandak, Jakarta Selatan</p>
            <div className="space-y-1">
              <p>
                📞{' '}
                <a href="tel:+622172800617" className="hover:underline">
                  +6221-7280-0617
                </a>
              </p>
              <p>
                📱{' '}
                <a
                  href="https://wa.me/628114110440?text=Halo%20Groovy%20VetCare%2C%20saya%20ingin%20bertanya%20lebih%20lanjut."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-green-300"
                >
                  +62 811-4110-440
                </a>
              </p>
              <p>
                📧{' '}
                <a href="mailto:groovyvetcare@medivet.pet" className="hover:underline">
                  groovyvetcare@medivet.pet
                </a>
              </p>
            </div>
            <a
              href="https://www.google.com/maps/place/Groovy+Vetcare+Clinic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-600 mt-4 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              📍 Google Maps Direction
            </a>

            
          </div>

          {/* Tentang Kami */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">Tentang Kami</h3>
            <p className="mb-3">
              Groovy Vetcare Clinic adalah bagian dari jaringan MEDIVET Pet Hospital &amp; Clinic Network.
            </p>
            <p>
              Kami juga bagian dari Groovy Group yang berfokus pada layanan hewan seperti Pet Shop, Klinik,
              Transportasi Hewan, Pet Hotel, dan Cat Cafe.
            </p>
          </div>

          {/* Jam Layanan */}
          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
              🕒 Service Hours
            </h3>
            <ul className="text-sm divide-y divide-gray-200">
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 Monday – Saturday</span>
                <span className="text-gray-700">09:00 - 19:30 WIB</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 Sunday</span>
                <span className="text-gray-700">10:00 - 15:30 WIB</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 National Holidays</span>
                <span className="text-gray-700">10:00 - 15:30 WIB</span>
              </li>
            </ul>
            <div className="mt-5 bg-red-600 text-white text-center p-4 rounded-lg">
              <p className="font-bold text-base">🚨 Emergency Service 24 Hours</p>
              <p className="text-sm mt-1 italic text-gray-100">Temporarily Unavailable</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/80">
          © 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeUser;