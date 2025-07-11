import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestHeader = () => {
  const [showLayananMenu, setShowLayananMenu] = useState(false);
  const navigate = useNavigate();

  const handleLayananHeaderClick = () => {
    setShowLayananMenu(!showLayananMenu);
  };

  // All navigation in GuestHeader goes to login
  const goToLoginPage = () => {
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groovy VetCare</h1>
        <nav className="space-x-4 flex items-center">
          <a href="/homeuser" className="hover:underline">Beranda</a>

          <a href="/login" className="hover:underline">Pembelian Produk</a>

          <div className="relative">
            <button
              onClick={handleLayananHeaderClick}
              className="hover:underline flex items-center gap-1"
            >
              Layanan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  showLayananMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLayananMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20 animate-fade-down">
                <button
                  onClick={goToLoginPage}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  Penitipan Hewan
                </button>
                <button
                  onClick={goToLoginPage}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  Kebiri
                </button>
                <button
                  onClick={goToLoginPage}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition"
                >
                  Vaksinasi
                </button>
              </div>
            )}
          </div>

          <a href="/faq-page" className="hover:underline">FAQ</a>
          <button
            onClick={goToLoginPage}
            className="ml-4 bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-blue-100 transition"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
};

export default GuestHeader;