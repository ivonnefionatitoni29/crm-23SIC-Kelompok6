import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { supabase } from '../supabase'; // Import Supabase instance

const HomeUserLogin = () => {
  // --- STATE DARI KEDUA VERSI ---
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true); // New loading state for FAQs
  const [errorFaqs, setErrorFaqs] = useState(null); // New error state for FAQs
  const [username, setUsername] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  // New states for user authentication details
  const [currentUser, setCurrentUser] = useState(null); // Stores { id, email, role }

  const navigate = useNavigate();

  // --- IMAGES & FUNCTIONS DARI KEDUA VERSI ---
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

  // Function to fetch FAQs from Supabase (identical to the one in FAQ admin)
  const fetchFaqs = async () => {
    setLoadingFaqs(true);
    setErrorFaqs(null);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching FAQs for HomeUserLogin:', error.message);
      setErrorFaqs('Gagal memuat FAQ. Sila cuba lagi.');
    } else {
      setFaqs(data);
    }
    setLoadingFaqs(false);
  };

  // Function to fetch loyalty points from Supabase
  const fetchLoyaltyPoints = async (userId) => {
    if (!userId) {
      setLoyaltyPoints(0);
      return;
    }
    const { data, error } = await supabase
      .from('dataloyalitas')
      .select('poinloyalitas')
      .eq('id_pelanggan', userId)
      .single(); // Use single() because there should be only one entry per user

    if (error) {
      console.error('Error fetching loyalty points:', error.message);
      setLoyaltyPoints(0); // Set to 0 if an error occurs or no data is found
    } else if (data) {
      setLoyaltyPoints(data.poinloyalitas);
    } else {
      setLoyaltyPoints(0); // If data is null (no entry for this user)
    }
  };

  // --- LOGIKA useEffect TERBAIK DARI VERSI 2 DENGAN PENAMBAHAN LOGIKA OTENTIKASI ---
  useEffect(() => {
    // Authentication Logic
    const checkUserAuthentication = async () => { // Made async to await fetchLoyaltyPoints
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole"); // Assuming role is stored
      const userNama = localStorage.getItem("username"); // Assuming display name is stored as 'username'

      if (isLoggedIn && userId && userEmail) {
        setCurrentUser({ id: userId, email: userEmail, role: userRole });
        // Prioritize userNama for display, then userEmail, fallback to "Pengguna"
        setUsername(userNama || userEmail || "Pengguna");

        // Fetch loyalty points for the logged-in user from Supabase
        await fetchLoyaltyPoints(userId);

      } else {
        setCurrentUser(null);
        setUsername("Pengguna"); // Default display name
        setLoyaltyPoints(0); // Reset loyalty points if not logged in
        navigate("/login"); // Redirect to login page
      }
    };

    // Initial checks and loads
    checkUserAuthentication();
    setCartItemCount(getTotalItemsInCart());
    fetchFaqs(); // Fetch FAQs from Supabase on mount

    // Real-time subscription for FAQs
    const faqChannel = supabase
      .channel('public:faqs_homeuserlogin_changes') // Unique channel name for this component
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, payload => {
        console.log('Realtime change received for FAQs (HomeUserLogin):', payload);
        fetchFaqs(); // Re-fetch data on any change
      })
      .subscribe();

    // Real-time subscription for loyalty points
    const loyaltyChannel = supabase
      .channel('public:dataloyalitas_changes') // Unique channel name
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dataloyalitas' }, payload => {
        console.log('Realtime change received for loyalty points:', payload);
        // Re-fetch loyalty points for the current user if their data changes
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
          fetchLoyaltyPoints(currentUserId);
        }
      })
      .subscribe();


    // Carousel auto-slide
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    // Event listener for monitoring localStorage changes (for cart and auth updates)
    const handleStorageChange = (event) => {
      // Update cart count
      if (event.key === "cart") {
        setCartItemCount(getTotalItemsInCart());
      }
      // Re-check auth if relevant storage items change
      if (event.key === "isLoggedIn" || event.key === "userId" || event.key === "userEmail" || event.key === "username") {
        checkUserAuthentication();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup when component unmounts
    return () => {
      clearInterval(slideInterval);
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(faqChannel); // Unsubscribe from FAQ channel
      supabase.removeChannel(loyaltyChannel); // Unsubscribe from loyalty channel
    };
  }, [images.length, navigate]); // Add navigate to dependency array

  // Fungsi untuk mengambil total item di keranjang dari localStorage
  const getTotalItemsInCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return 0;
    }
  };

  const formatPoints = (points) => {
    return points.toLocaleString('id-ID');
  };

  // Prevent rendering if not authenticated yet to avoid flickering
  if (currentUser === null && localStorage.getItem("isLoggedIn") === "true") {
    // This means we are still in the process of checking auth,
    // or some auth data is missing, but isLoggedIn is true.
    // You might want a loading spinner here instead of just returning null.
    return null;
  }

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* --- HEADER TERBAIK DARI VERSI 2 --- */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-6 flex items-center">
            <Link to="/homeuserlogin" className="hover:underline">Beranda</Link>
            <Link to="/pelangganjb" className="hover:underline">Pembelian Produk</Link>

            <div className="relative">
              <button onClick={handleReservasiClick} className="hover:underline flex items-center gap-1">
                Layanan
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform duration-300 ${showReservasiMenu ? "rotate-180" : "rotate-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  <Link to="/form-penitipan" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Penitipan Hewan</Link>
                  <Link to="/form-kebiri" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Kebiri</Link>
                  <Link to="/form-vaksinasi" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Vaksinasi</Link>
                </div>
              )}
            </div>

            <Link to="/faq-page" className="hover:underline" onClick={() => setShowReservasiMenu(false)}>FAQ</Link>

            <div className="flex items-center space-x-2">
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profil" className="w-8 h-8 rounded-full" />
              <span>{username || "Pengguna"}</span> {/* Displaying the username */}
            </div>

            {/* Loyalty Points Header */}
            {loyaltyPoints > 0 && ( // Only show loyalty points if points are positive
              <Link to="/loyalty" className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-yellow-600 transition-colors">
                Poin: {formatPoints(loyaltyPoints)} ⭐
              </Link>
            )}

            <Link to="/pelangganjb" className="relative bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-300">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">{cartItemCount}</span>
              )}
            </Link>

            <button onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userRole");
                localStorage.removeItem("username"); // Clear the display name as well
                window.location.href = "/login"; // Full page reload to clear all state
            }} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative">
        <img src={images[currentSlide]} alt="Hero" className="w-full h-[400px] object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col justify-center items-center text-white px-4">
          <h2 className="text-4xl font-bold mb-2 text-center">Selamat Datang di Groovy VetCare</h2>
          <p className="text-lg mb-4 text-center max-w-xl">Periksa dan rawat hewan kesayanganmu bersama dokter terbaik kami.</p>
          <button onClick={() => goToPage("/form-penitipan")} className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600 transition">
            Buat Janji
          </button>
        </div>
      </section>

      {/* --- BAGIAN PREDIKSI KESEHATAN (DARI VERSI 1) --- */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 flex justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Health Prediction" className="w-64 md:w-80 drop-shadow-xl" />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-blue-700 mb-4 leading-snug">Prediksi Kesehatan Hewanmu</h2>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              Manfaatkan kecerdasan buatan (AI) untuk membantu mendiagnosis kondisi awal kesehatan hewan peliharaanmu. Jawab beberapa pertanyaan sederhana dan dapatkan hasil prediksi dalam hitungan detik!
            </p>
            <button onClick={() => navigate("/prediksi-kesehatan")} className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-3 rounded-full font-semibold shadow-md transition duration-300">
              🔍 Mulai Prediksi Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* --- BAGIAN LAYANAN --- */}
      <section id="layanan" className="py-12 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Layanan Utama Kami</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div onClick={() => goToPage("/pelangganjb")} className="bg-white border hover:border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/2936/2936776.png" alt="Produk" className="w-20 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Pembelian Obat & Makanan</h4>
              <p className="text-sm text-gray-600">Dapatkan produk terbaik untuk hewan kesayanganmu.</p>
            </div>
            <div className="bg-white border hover:border-blue-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition relative">
              <div onClick={handleReservasiClick} className="cursor-pointer text-center flex flex-col items-center">
                <img src="https://cdn-icons-png.flaticon.com/512/7586/7586970.png" alt="Reservasi" className="w-20 mb-3 transition-transform duration-300 hover:scale-105" />
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  Reservasi Layanan
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform duration-300 ${showReservasiMenu ? "rotate-180" : "rotate-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </h4>
                <p className="text-sm text-gray-600">Klik untuk memilih jenis layanan reservasi.</p>
              </div>
              {showReservasiMenu && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[90%] max-w-xs bg-white border border-blue-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                  {[ { label: "Penitipan Hewan", path: "/form-penitipan" }, { label: "Kebiri", path: "/form-kebiri" }, { label: "Vaksinasi", path: "/form-vaksinasi" } ].map((layanan) => (
                    <button key={layanan.label} onClick={() => { goToPage(layanan.path); setShowReservasiMenu(false); }} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">
                      {layanan.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- BAGIAN FAQ (LOGIKA TAMPILAN DARI VERSI 1, DIPERBARUI DENGAN SUPABASE DATA) --- */}
      <section id="faq" className="bg-white py-12">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-3xl font-bold text-center mb-8 text-blue-700">Pertanyaan Umum (FAQ)</h3>
          <div className="space-y-4 text-left">
            {loadingFaqs ? (
              <p className="text-center text-blue-600">Memuat FAQ...</p>
            ) : errorFaqs ? (
              <p className="text-center text-red-500">{errorFaqs}</p>
            ) : faqs.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada FAQ yang tersedia.</p>
            ) : (
              faqs.slice(0, 3).map(({ question, answer, id }) => ( // Added 'id' for the key
                <details key={id} className="border border-blue-300 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition">
                  <summary className="cursor-pointer font-semibold text-blue-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                    {question}
                  </summary>
                  <p className="mt-2 text-blue-900 text-sm leading-relaxed">{answer}</p>
                </details>
              ))
            )}
          </div>
          {faqs.length > 3 && (
            <div className="text-center mt-6">
              <button onClick={() => navigate("/faq-page")} className="text-blue-700 hover:underline font-medium">
                ➕ Lihat Semua FAQ
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-blue-700 text-white py-10 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
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
            <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-pink-600 mt-4 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition">
              📍 Google Maps Direction
            </a>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">Tentang Kami</h3>
            <p className="mb-3">Groovy Vetcare Clinic adalah bagian dari jaringan MEDIVET Pet Hospital & Clinic Network.</p>
            <p>Kami juga bagian dari Groovy Group yang berfokus pada layanan hewan seperti Pet Shop, Klinik, Transportasi Hewan, Pet Hotel, dan Cat Cafe.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">🕒 Service Hours</h3>
            <ul className="text-sm divide-y divide-gray-200">
              <li className="flex justify-between py-2"><span className="font-medium">📅 Monday – Saturday</span><span className="text-gray-700">09:00 - 19:30 WIB</span></li>
              <li className="flex justify-between py-2"><span className="font-medium">📅 Sunday</span><span className="text-gray-700">10:00 - 15:30 WIB</span></li>
              <li className="flex justify-between py-2"><span className="font-medium">📅 National Holidays</span><span className="text-gray-700">10:00 - 15:30 WIB</span></li>
            </ul>
            <div className="mt-5 bg-red-600 text-white text-center p-4 rounded-lg">
              <p className="font-bold text-base">🚨 Emergency Service 24 Hours</p>
              <p className="text-sm mt-1 italic text-gray-100">Temporarily Unavailable</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-white/80">© 2025 Groovy Vetcare. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default HomeUserLogin;