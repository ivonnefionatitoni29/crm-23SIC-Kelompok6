import React, { useState, useEffect } from "react";

const HomeUserLogin = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const images = [
    "https://bic.id/wp-content/uploads/2023/12/dokter-Hewan-Lulusan-Dari-Fakultas-Kedokteran-Hewan.webp",
    "https://cnc-magazine.oramiland.com/parenting/images/dokter-hewan-bandar-lampung.width-800.format-webp.webp",
    "https://bolumenara.co.id/uploads/8/2023-10/dokter_hewan.png",
  ];

  const handleReservasiClick = () => {
    setShowReservasiMenu(!showReservasiMenu);
  };

  const goToPage = (path) => {
    // Simulate navigation - in real app this would use react-router
    console.log(`Navigating to: ${path}`);
    alert(`Navigation to: ${path}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userPoints = 150;
  const maxPoints = 200;
  const loyaltyLevel =
    userPoints >= 200 ? "Gold" : userPoints >= 100 ? "Silver" : "Bronze";

  const loyaltyColors = {
    Bronze: "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
    Silver: "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800",
    Gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900",
  };

  const progressPercent = Math.min((userPoints / maxPoints) * 100, 100);

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with scroll effect */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg text-gray-800' 
          : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo with animation */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Groovy VetCare
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-x-8 flex items-center">
            <a href="#" className="hover:text-green-400 transition-colors relative group">
              Beranda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#layanan" className="hover:text-green-400 transition-colors relative group">
              Layanan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#faq" className="hover:text-green-400 transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
            </a>

            {/* Profile with enhanced design */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="relative">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Profil"
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-medium">{localStorage.getItem("username") || "Pengguna"}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section with enhanced design */}
      <section className="relative h-[600px] overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img
            src={images[currentSlide]}
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-green-400/30 rounded-full animate-pulse"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-16">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Selamat Datang di
              <span className="block text-green-400 text-4xl md:text-5xl">Groovy VetCare</span>
            </h2>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami. 
              Memberikan layanan terpercaya dengan teknologi modern.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => goToPage("/form-vaksinasi")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-2xl font-semibold text-lg"
              >
                🗓️ Buat Janji Sekarang
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all border border-white/30 font-semibold text-lg">
                📞 Hubungi Kami
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Loyalty Section with enhanced design */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-green-200/30 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full translate-x-20 translate-y-20"></div>
        
        <div className="container mx-auto max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full">
                <span className="text-3xl">🏆</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Poin Loyalitas Kamu
            </h3>
            
            <div className="mb-8">
              <div className="text-7xl font-extrabold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {userPoints}
              </div>
              <span className="text-2xl font-medium text-gray-500">poin</span>
            </div>
            
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner mb-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-in-out ${loyaltyColors[loyaltyLevel]} shadow-lg`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Bronze</span>
                <span className="text-sm text-gray-500">Silver</span>
                <span className="text-sm text-gray-500">Gold</span>
              </div>
              
              <div className={`inline-block px-6 py-3 rounded-full font-semibold text-lg ${loyaltyColors[loyaltyLevel]} shadow-lg`}>
                {loyaltyLevel === "Gold" && "👑"} Level {loyaltyLevel}
              </div>
              
              {loyaltyLevel !== "Gold" && (
                <p className="mt-4 text-gray-600 bg-gray-50 p-4 rounded-xl">
                  Kumpulkan <strong className="text-green-600">{maxPoints - userPoints}</strong> poin lagi
                  untuk naik ke level berikutnya! 🚀
                </p>
              )}
              
              {loyaltyLevel === "Gold" && (
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <p className="text-yellow-800 font-semibold">
                    🎉 Selamat! Kamu sudah di level tertinggi! 🎉
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Nikmati semua benefit eksklusif member Gold
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with enhanced cards */}
      <section id="layanan" className="py-16 bg-white relative">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Layanan Terbaik Kami
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan berkualitas tinggi untuk hewan kesayangan Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Enhanced Product Card */}
            <div
              onClick={() => goToPage("/pelangganjb")}
              className="group bg-gradient-to-br from-white to-green-50 border-2 border-transparent hover:border-green-400 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            >
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2936/2936776.png"
                  alt="Produk"
                  className="w-12 h-12"
                />
              </div>
              <h4 className="font-bold text-xl mb-4 text-gray-800">
                🛍️ Pembelian Obat & Makanan
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan produk terbaik untuk hewan kesayanganmu dengan kualitas terjamin
                dan harga terjangkau.
              </p>
              <div className="mt-6 inline-flex items-center text-green-600 font-semibold group-hover:text-green-700">
                Belanja Sekarang
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Enhanced Reservation Card */}
            <div className="relative bg-gradient-to-br from-white to-blue-50 border-2 border-transparent hover:border-blue-400 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div
                onClick={handleReservasiClick}
                className="cursor-pointer text-center"
              >
                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7586/7586970.png"
                    alt="Reservasi"
                    className="w-12 h-12"
                  />
                </div>
                <h4 className="font-bold text-xl mb-4 text-gray-800 flex items-center justify-center">
                  📅 Reservasi Layanan
                  <svg className={`w-5 h-5 ml-2 transition-transform ${showReservasiMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Pilih jenis layanan reservasi yang sesuai dengan kebutuhan hewan peliharaan Anda.
                </p>
              </div>
              
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-20 w-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center">
                    <h5 className="font-semibold">Pilih Layanan</h5>
                  </div>
                  
                  <button
                    onClick={() => goToPage("/form-penitipan")}
                    className="flex items-center w-full px-6 py-4 hover:bg-blue-50 transition-colors border-b border-gray-100"
                  >
                    <span className="text-2xl mr-4">🏠</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Penitipan Hewan</div>
                      <div className="text-sm text-gray-600">Titipkan hewan dengan aman</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => goToPage("/form-kebiri")}
                    className="flex items-center w-full px-6 py-4 hover:bg-blue-50 transition-colors border-b border-gray-100"
                  >
                    <span className="text-2xl mr-4">⚕️</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Kebiri</div>
                      <div className="text-sm text-gray-600">Layanan sterilisasi profesional</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => goToPage("/form-vaksinasi")}
                    className="flex items-center w-full px-6 py-4 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl mr-4">💉</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-800">Vaksinasi</div>
                      <div className="text-sm text-gray-600">Perlindungan kesehatan optimal</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section id="faq" className="bg-gradient-to-br from-gray-50 to-green-50 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Pertanyaan Umum (FAQ)
            </h3>
            <p className="text-gray-600 text-lg">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Apa saja jenis hewan yang bisa ditangani?",
                answer: "Kami melayani berbagai jenis hewan peliharaan seperti anjing, kucing, kelinci, hamster, dan hewan kecil lainnya. Tim dokter kami berpengalaman menangani berbagai spesies.",
                icon: "🐕"
              },
              {
                question: "Apakah bisa reservasi tanpa login?",
                answer: "Reservasi memerlukan akun agar data hewan dan riwayat layanan dapat tercatat dengan baik. Ini membantu kami memberikan perawatan terbaik dan melacak kesehatan hewan Anda.",
                icon: "👤"
              },
              {
                question: "Apakah tersedia layanan darurat?",
                answer: "Saat ini layanan darurat tersedia khusus untuk pelanggan loyal dengan level Silver dan Gold. Hubungi kami melalui hotline untuk informasi lebih lanjut mengenai layanan darurat.",
                icon: "🚨"
              },
              {
                question: "Bagaimana cara mendapatkan poin loyalitas?",
                answer: "Poin loyalitas didapat setiap kali Anda menggunakan layanan kami. Semakin sering berkunjung, semakin banyak poin yang terkumpul untuk mendapatkan benefit eksklusif.",
                icon: "🏆"
              }
            ].map(({ question, answer, icon }, idx) => (
              <details
                key={idx}
                className="group bg-white border-2 border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300"
              >
                <summary className="cursor-pointer font-bold text-lg text-green-800 flex items-center gap-4 list-none">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                      {icon}
                    </span>
                    <span className="flex-1">{question}</span>
                    <svg
                      className="w-6 h-6 text-green-600 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="mt-4 pl-16">
                  <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-xl">
                    {answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-green-800 via-green-700 to-blue-800 text-white py-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Enhanced Info Klinik */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🐾</span>
              </div>
              <h3 className="text-2xl font-bold">Groovy Vetcare Clinic</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h4 className="font-semibold mb-3 text-green-300">📍 Alamat Klinik</h4>
              <p className="mb-1">Ruko Galeri Niaga No. 9F-G</p>
              <p className="mb-1">Jl. Haji Nawi Raya, Kel. Gandaria Selatan,</p>
              <p className="mb-4">Kec. Cilandak, Jakarta Selatan</p>
              
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="text-green-300 mr-2">📞</span>
                  +6221-7280-0617
                </p>
                <p className="flex items-center">
                  <span className="text-green-300 mr-2">📱</span>
                  +62 811-4110-440
                </p>
                <p className="flex items-center">
                  <span className="text-green-300 mr-2">📧</span>
                  groovyvetcare@medivet.pet
                </p>
              </div>
            </div>
            
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              📍 Google Maps Direction
            </a>
          </div>

          {/* Enhanced Service Hours */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800 h-full">
              <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center justify-center gap-2">
                🕒 Jam Layanan
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-semibold text-green-800">📅 Senin - Sabtu</span>
                  <span className="text-green-700 font-medium">09:00 - 19:30 WIB</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-800">📅 Minggu</span>
                  <span className="text-blue-700 font-medium">10:00 - 15:30 WIB</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-purple-800">📅 Hari Libur Nasional</span>
                  <span className="text-purple-700 font-medium">10:00 - 15:30 WIB</span>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-center p-4 rounded-xl shadow-lg">
                <p className="font-bold text-lg mb-1">
                  🚨 Emergency Service 24 Hours
                </p>
                <p className="text-sm text-red-100 italic">
                  Temporarily Unavailable
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Credit */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6">
            <p className="text-white/80 text-sm">
              &copy; 2025 Groovy Vetcare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeUserLogin;





// homeuserlogin, pelangganjb, loyslitas admin