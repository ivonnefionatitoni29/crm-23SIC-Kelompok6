import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeUser = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [faqs, setFaqs] = useState([]);
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
    const storedFaqs = localStorage.getItem("faqs");
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    }
  }, []);

  const userPoints = 150;
  const maxPoints = 200; // Max poin untuk Gold
  const loyaltyLevel =
    userPoints >= 200 ? "Gold" : userPoints >= 100 ? "Silver" : "Bronze";

  // Warna dan style badge sesuai level
  const loyaltyColors = {
    Bronze: "bg-yellow-500 text-yellow-900",
    Silver: "bg-gray-300 text-gray-800",
    Gold: "bg-yellow-400 text-yellow-900",
  };

  // Persentase progress bar
  const progressPercent = Math.min((userPoints / maxPoints) * 100, 100);

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4 flex items-center">
            <a href="#" className="hover:underline">
              Beranda
            </a>
            <a href="#layanan" className="hover:underline">
              Layanan
            </a>
            <a href="/faq-page" className="hover:underline">
              FAQ
            </a>
            <button
              onClick={() => goToPage("/login")}
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
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-4xl font-bold mb-2 text-center">
            Selamat Datang di Groovy VetCare
          </h2>
          <p className="text-lg mb-4 text-center max-w-xl">
            Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami.
          </p>
          <button
            onClick={() => goToPage("/login")}
            className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Buat Janji
          </button>
        </div>
      </section>

      {/* Prediksi Kesehatan Hewan */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Ilustrasi */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
              alt="Health Prediction"
              className="w-64 md:w-80 drop-shadow-xl"
            />
          </div>

          {/* Konten Teks */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-blue-700 mb-4 leading-snug">
              Prediksi Kesehatan Hewanmu
            </h2>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              Manfaatkan kecerdasan buatan (AI) untuk membantu mendiagnosis
              kondisi awal kesehatan hewan peliharaanmu. Jawab beberapa
              pertanyaan sederhana dan dapatkan hasil prediksi dalam hitungan
              detik!
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-full font-semibold shadow-md transition duration-300"
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
              onClick={() => goToPage("/login")}
              className="bg-white border hover:border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2936/2936776.png"
                alt="Produk"
                className="w-20 mb-4"
              />
              <h4 className="font-semibold text-lg mb-2">
                Pembelian Obat & Makanan
              </h4>
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
                    className={`h-4 w-4 transform transition-transform duration-300 ${
                      showReservasiMenu ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </h4>
                <p className="text-sm text-gray-600">
                  Klik untuk memilih jenis layanan reservasi.
                </p>
              </div>

              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[90%] max-w-xs bg-white border border-blue-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  {["Penitipan Hewan", "Kebiri", "Vaksinasi"].map((layanan) => (
                    <button
                      key={layanan}
                      onClick={() => goToPage("/login")}
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

      {/* FAQ */}
      <section id="faq" className="bg-white py-12">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-3xl font-bold text-center mb-8 text-blue-700">
            Pertanyaan Umum (FAQ)
          </h3>
          <div className="space-y-4 text-left">
            {faqs.length === 0 ? (
              <p className="text-center text-gray-500">
                Belum ada FAQ yang tersedia.
              </p>
            ) : (
              faqs.slice(0, 3).map(({ question, answer }, idx) => (
                <details
                  key={idx}
                  className="border border-blue-300 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition"
                >
                  <summary className="cursor-pointer font-semibold text-blue-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                    {question}
                  </summary>
                  <p className="mt-2 text-blue-900 text-sm leading-relaxed">
                    {answer}
                  </p>
                </details>
              ))
            )}
          </div>

          {/* Tombol Lihat Semua */}
          {faqs.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/faq-page")}
                className="text-blue-700 hover:underline font-medium"
              >
                ➕ Lihat Semua FAQ
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-10 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Info Klinik */}
          <div>
            <h3 className="text-xl font-bold mb-3">Groovy Vetcare Clinic</h3>
            <p className="mb-1">Ruko Galeri Niaga No. 9F-G</p>
            <p className="mb-1">Jl. Haji Nawi Raya, Kel. Gandaria Selatan,</p>
            <p className="mb-2">Kec. Cilandak, Jakarta Selatan</p>
            <div className="space-y-1">
              <p>📞 +6221-7280-0617</p>
              <p>📱 +62 811-4110-440</p>
              <p>📧 groovyvetcare@medivet.pet</p>
            </div>
            <a
              href="https://maps.google.com"
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
              Groovy Vetcare Clinic adalah bagian dari jaringan MEDIVET Pet
              Hospital & Clinic Network.
            </p>
            <p>
              Kami juga bagian dari Groovy Group yang berfokus pada layanan
              hewan seperti Pet Shop, Klinik, Transportasi Hewan, Pet Hotel, dan
              Cat Cafe.
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
              <p className="font-bold text-base">
                🚨 Emergency Service 24 Hours
              </p>
              <p className="text-sm mt-1 italic text-gray-100">
                Temporarily Unavailable
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 text-center text-xs text-white/80">
          &copy; 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeUser;
