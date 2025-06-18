import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom"; // untuk tombol login

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFaqs = localStorage.getItem("faqs");
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    }
  }, []);

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4 flex items-center">
            <a href="/" className="hover:underline">Beranda</a>
            <a href="#layanan" className="hover:underline">Layanan</a>
            <a href="/faq-page" className="hover:underline">FAQ</a>
            <button
              onClick={() => goToPage('/login')}
              className="ml-4 bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-green-100 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Konten FAQ */}
      <main className="min-h-screen bg-gradient-to-b from-white via-green-50 to-green-100 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
            Pertanyaan Umum (FAQ)
          </h1>

          {faqs.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada FAQ.</p>
          ) : (
            <div className="space-y-4">
              {faqs.map(({ question, answer }, idx) => (
                <details
                  key={idx}
                  className="group border border-green-200 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-medium text-green-800">
                    {question}
                    <ChevronDown className="h-5 w-5 text-green-500 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <p className="mt-3 text-green-900 text-sm leading-relaxed">{answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-10 px-6 text-sm">
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
              Groovy Vetcare Clinic adalah bagian dari jaringan MEDIVET Pet Hospital & Clinic Network.
            </p>
            <p>
              Kami juga bagian dari Groovy Group yang berfokus pada layanan hewan seperti Pet Shop, Klinik,
              Transportasi Hewan, Pet Hotel, dan Cat Cafe.
            </p>
          </div>

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
              <p className="font-bold text-base">🚨 Emergency Service 24 Hours</p>
              <p className="text-sm mt-1 italic text-gray-100">Temporarily Unavailable</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-white/80">
          &copy; 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default FaqPage;
