import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom"; // untuk tombol login

// SANGAT PENTING: Sila sesuaikan jalur import supabase ini mengikut struktur folder projek anda.
// Ralat "Could not resolve" ini berterusan, menunjukkan bahawa fail 'supabase.js' anda TIDAK DITEMUI
// pada jalur relatif yang telah dicuba setakat ini.
//
// Untuk menyelesaikan ini secara muktamad, anda perlu memberitahu LOKASI TEPAT fail 'supabase.js' anda.
// Sila GANTI baris 'import { supabase } = ...' di bawah ini dengan jalur yang BETUL setelah anda mengesahkannya sendiri.
//
// Contoh:
// - Jika jalur penuh fail anda ialah: D:/project062025/crm-23SIC-Kelompok6/src/supabase.js
//   Maka, import yang BETUL adalah: import { supabase } from "../supabase";
//
// - Jika fail itu berada di: D:/project062025/crm-23SIC-Kelompok6/supabase.js (akar projek, satu folder di atas 'src')
//   Maka, import yang BETUL adalah: import { supabase } from "../../supabase";
//
// - Jika di 'src/utils/supabase.js': import { supabase } from "../utils/supabase";
// - Jika di 'src/config/supabase.js': import { supabase } from "../config/supabase";
//
// Sila pastikan anda memilih HANYA SATU daripada jalur di atas (atau jalur lain yang betul jika tiada yang sepadan)
// dan gunakan ia. Saya akan meninggalkan yang paling umum sebagai lalai buat masa ini.
import { supabase } from "../supabase"; // SILA GANTI BARIS INI DENGAN JALUR YANG BETUL!


const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showReservasiMenu, setShowReservasiMenu] = useState(false); // State baru untuk dropdown

  // Fungsi untuk mengambil FAQ dari Supabase
  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching FAQs for public page:', error.message);
      setError('Gagal memuat FAQ. Sila cuba lagi nanti.');
    } else {
      setFaqs(data);
    }
    setLoading(false);
  };

  // Efek untuk memuat FAQ saat komponen dipasang dan berlangganan pembaruan real-time
  useEffect(() => {
    fetchFaqs();

    const channel = supabase
      .channel('public:faqs_page_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, payload => {
        console.log('Realtime change received for public FAQs:', payload);
        fetchFaqs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const goToPage = (path) => {
    navigate(path);
  };

  // Fungsi untuk menangani klik pada tombol "Layanan"
  const handleReservasiClick = () => {
    setShowReservasiMenu(!showReservasiMenu);
  };

  // Tutup dropdown jika klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReservasiMenu && !event.target.closest('.relative')) {
        setShowReservasiMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReservasiMenu]);


  return (
    <>
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => navigate("/homeuser")}
            className="text-2xl font-bold cursor-pointer hover:text-blue-300 transition"
          >
            Groovy VetCare
          </h1>
          <nav className="space-x-4 flex items-center">
            <a href="/" className="hover:underline">Beranda</a>
            <a href="#layanan" className="hover:underline">Layanan</a>
            <a href="/faq-page" className="hover:underline">FAQ</a>
            <button
              onClick={() => goToPage("/login")}
              className="ml-4 bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 pt-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-12">
            Pertanyaan Umum (FAQ)
          </h1>

          {loading && (
            <p className="text-center text-lg text-blue-600">Memuat FAQ...</p>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!loading && !error && faqs.length === 0 ? (
            <p className="text-center text-gray-500">Tiada FAQ yang tersedia buat masa ini.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group border border-blue-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-medium text-blue-800">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 text-blue-500 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <p className="mt-3 text-blue-900 text-sm leading-relaxed">{answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-600 mt-4 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              📍 Google Maps Direction
            </a>
          </div>

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
        <div className="mt-8 text-center text-xs text-white/80">
          © 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default FaqPage;