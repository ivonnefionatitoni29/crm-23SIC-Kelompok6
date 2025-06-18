import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; // Import ShoppingCart icon

const HomeUserLogin = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [username, setUsername] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0); // State baru untuk jumlah item keranjang
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

  // Function to get total items in cart from localStorage
  const getTotalItemsInCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return 0;
    }
  };

  useEffect(() => {
    // Load FAQs
    const storedFaqs = localStorage.getItem("faqs");
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    }

    // Load username and loyalty points
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      const storedLoyaltyData = JSON.parse(localStorage.getItem('dataLoyalitas')) || [];
      const currentUserLoyalty = storedLoyaltyData.find(
        (customer) => customer.namaPelanggan === storedUsername
      );
      if (currentUserLoyalty) {
        setLoyaltyPoints(currentUserLoyalty.poinLoyalitas);
      }
    }

    // Load initial cart item count
    setCartItemCount(getTotalItemsInCart());

    // Carousel auto-slide
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    // Add event listener for localStorage changes (for cart updates)
    // This is a simple approach, for complex scenarios, a Context API might be better.
    const handleStorageChange = () => {
      setCartItemCount(getTotalItemsInCart());
    };
    window.addEventListener('storage', handleStorageChange);


    return () => {
      clearInterval(slideInterval);
      window.removeEventListener('storage', handleStorageChange);
    }; // Clean up on component unmount
  }, [images.length]);

  const formatPoints = (points) => {
    return points.toLocaleString('id-ID');
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-6 flex items-center">
            <Link to="/homeuserlogin" className="hover:underline">Beranda</Link>
            
            {/* Navigasi "Pembelian Produk" ke halaman pelangganjb */}
            <Link to="/pelangganjb" className="hover:underline">Pembelian Produk</Link>

            {/* Dropdown untuk Layanan Reservasi */}
            <div className="relative">
              <button
                onClick={handleReservasiClick}
                className="hover:underline flex items-center gap-1"
              >
                Layanan
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform duration-300 ${showReservasiMenu ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-green-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  <Link
                    to="/form-penitipan"
                    onClick={() => setShowReservasiMenu(false)}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                  >
                    Penitipan Hewan
                  </Link>
                  <Link
                    to="/form-kebiri"
                    onClick={() => setShowReservasiMenu(false)}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                  >
                    Kebiri
                  </Link>
                  <Link
                    to="/form-vaksinasi"
                    onClick={() => setShowReservasiMenu(false)}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                  >
                    Vaksinasi
                  </Link>
                </div>
              )}
            </div>

            <a href="#faq" className="hover:underline">FAQ</a>

            {/* Profil + Username */}
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profil"
                className="w-8 h-8 rounded-full"
              />
              <span>{username || "Pengguna"}</span>
            </div>

            {/* Tampilkan Poin Loyalitas */}
            {username && (
              <Link to="/loyalty" className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-yellow-600 transition-colors">
                Poin: {formatPoints(loyaltyPoints)} ⭐
              </Link>
            )}

            {/* Keranjang Belanja */}
            <Link 
              to="/pelangganjb" // Arahkan ke halaman produk untuk melihat keranjang lebih detail
              className="relative bg-[#08a43c] hover:bg-[#067a2f] text-white p-3 rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>


            {/* Tombol Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                // Perbarui juga data loyalitas jika diperlukan (opsional, tergantung kebutuhan)
                window.location.href = "/login";
              }}
              className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
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
            onClick={() => goToPage("/form-penitipan")} /* Mengarahkan ke form penitipan */
            className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Buat Janji
          </button>
        </div>
      </section>

      {/* Layanan */}
      <section id="layanan" className="py-12 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Layanan Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pembelian Produk */}
            <div
              onClick={() => goToPage("/pelangganjb")}
              className="bg-white border hover:border-green-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center"
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
            {/* The actual dropdown content is now in the header,
                this section remains for visual consistency/alternative access */}
            <div className="bg-white border hover:border-green-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition relative">
              <div
                onClick={handleReservasiClick} // Tetap gunakan handler untuk membuka menu
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
                    className={`h-4 w-4 transform transition-transform duration-300 ${showReservasiMenu ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-sm text-gray-600">Klik untuk memilih jenis layanan reservasi.</p>
              </div>
              {/* Menu dropdown di sini dihilangkan karena sudah ada di header,
                  tapi logika toggle masih bisa digunakan jika ingin ada menu di sini juga */}
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[90%] max-w-xs bg-white border border-green-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  {[
                    { label: "Penitipan Hewan", path: "/form-penitipan" },
                    { label: "Kebiri", path: "/form-kebiri" },
                    { label: "Vaksinasi", path: "/form-vaksinasi" },
                  ].map((layanan) => (
                    <button
                      key={layanan.label}
                      onClick={() => {
                        goToPage(layanan.path);
                        setShowReservasiMenu(false); // Close dropdown after click
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                    >
                      {layanan.label}
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
          <h3 className="text-3xl font-bold text-center mb-8 text-green-700">
            Pertanyaan Umum (FAQ)
          </h3>
          <div className="space-y-4 text-left">
            {faqs.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada FAQ yang tersedia.</p>
            ) : (
              faqs.map(({ question, answer }, idx) => (
                <details
                  key={idx}
                  className="border border-green-300 rounded-lg p-4 bg-green-50 hover:bg-green-100 transition"
                >
                  <summary className="cursor-pointer font-semibold text-green-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
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
                  <p className="mt-2 text-green-900 text-sm leading-relaxed">
                    {answer}
                  </p>
                </details>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-10 px-6 text-sm">
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
              href="https://maps.google.com/maps?q=Ruko+Galeri+Niaga+No.+9F-G,+Jl.+Haji+Nawi+Raya,+Gandaria+Selatan,+Cilandak,+Jakarta+Selatan" // Updated Google Maps link
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
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
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
          © 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeUserLogin;


//asdasfasd