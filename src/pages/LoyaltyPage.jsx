import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader"; // Pastikan path sesuai dengan lokasi file komponen

const LoyaltyPage = () => {
  const [username, setUsername] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();

  const maxPoints = 200;
  const loyaltyLevel =
    userPoints >= 200 ? "Gold" : userPoints >= 100 ? "Silver" : "Bronze";

  const loyaltyColors = {
    Bronze: "bg-orange-400 text-orange-900",
    Silver: "bg-sky-300 text-sky-800",
    Gold: "bg-amber-400 text-amber-900",
  };

  const progressPercent = Math.min((userPoints / maxPoints) * 100, 100);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);

      const storedLoyaltyData = JSON.parse(localStorage.getItem('dataLoyalitas')) || [];

      const currentUserLoyalty = storedLoyaltyData.find(
        (customer) => customer.namaPelanggan === storedUsername
      );

      if (currentUserLoyalty) {
        setUserPoints(currentUserLoyalty.poinLoyalitas);
      }
    }
  }, []);

  const formatPoints = (points) => {
    return points.toLocaleString('id-ID');
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header digantikan dengan komponen UserHeader */}
      <UserHeader username={username} userPoints={userPoints} />

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <section className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center border border-blue-200">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            Program Poin Loyalitas Anda
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Terima kasih telah menjadi bagian dari Groovy VetCare! Berikut adalah detail poin dan level loyalitas Anda.
          </p>

          <div className="mb-4 text-7xl font-extrabold text-blue-600">
            {formatPoints(userPoints)}{" "}
            <span className="text-3xl font-medium text-gray-500">pts</span>
          </div>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
              <div
                className={`h-8 rounded-full transition-all duration-1000 ease-in-out ${loyaltyColors[loyaltyLevel]}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-gray-700 text-xl">
              Anda sedang berada di level{" "}
              <span
                className={`font-extrabold px-4 py-1 rounded-full text-lg ${loyaltyColors[loyaltyLevel]}`}
              >
                {loyaltyLevel}
              </span>
            </p>
            {loyaltyLevel !== "Gold" && (
              <p className="mt-2 text-md text-gray-500">
                Kumpulkan <strong>{maxPoints - userPoints}</strong> poin lagi
                untuk naik ke level berikutnya <strong>Gold</strong>!
              </p>
            )}
            {loyaltyLevel === "Gold" && (
              <p className="mt-2 text-md text-amber-700 font-semibold">
                Selamat! Anda sudah di level tertinggi 🎉 Nikmati semua keuntungan Gold Member!
              </p>
            )}
          </div>

          <div className="mt-8 text-left border-t pt-6 border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-blue-700">Keuntungan Loyalitas</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Bronze (0-99 Poin):</strong> Diskon 5% untuk layanan vaksinasi.</li>
              <li><strong>Silver (100-199 Poin):</strong> Diskon 10% untuk layanan vaksinasi dan gratis cek kesehatan dasar setiap 6 bulan.</li>
              <li><strong>Gold (200+ Poin):</strong> Diskon 15% untuk semua layanan, gratis cek kesehatan lengkap setiap 6 bulan, dan prioritas antrean.</li>
            </ul>
          </div>
        </section>
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
    </div>
  );
};

export default LoyaltyPage;
