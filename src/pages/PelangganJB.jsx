// PelangganJB.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PelangganJB = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simulasi fetch data produk - total 9 item
    setProducts([
      { id: 1, name: 'Makanan Kucing', price: 'Rp30.000', image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
      { id: 2, name: 'Vitamin Anjing', price: 'Rp25.000', image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png' },
      { id: 3, name: 'Obat Kutu', price: 'Rp45.000', image: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png' },
      { id: 4, name: 'Shampoo Hewan', price: 'Rp35.000', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046771.png' },
      { id: 5, name: 'Susu Anak Kucing', price: 'Rp20.000', image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
      { id: 6, name: 'Snack Anjing', price: 'Rp15.000', image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
      { id: 7, name: 'Obat Cacing', price: 'Rp28.000', image: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png' },
      { id: 8, name: 'Sisir Bulu', price: 'Rp18.000', image: 'https://cdn-icons-png.flaticon.com/512/2750/2750753.png' },
      { id: 9, name: 'Vitamin Kucing', price: 'Rp22.000', image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png' },
    ]);
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>
          <nav className="space-x-4 flex items-center">
            <a href="/" className="hover:underline">Beranda</a>
            <a href="/#layanan" className="hover:underline">Layanan</a>
            <a href="/#faq" className="hover:underline">FAQ</a>
            <button
              onClick={() => navigate('/login')}
              className="ml-4 bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-green-100 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Judul Halaman */}
      <section className="bg-white py-10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700">Pembelian Produk</h2>
          <p className="text-gray-600 mt-2">Temukan makanan, vitamin, dan obat terbaik untuk hewan peliharaanmu</p>
        </div>
      </section>

      {/* Daftar Produk */}
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-contain mb-4" />
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-green-600 font-bold mb-2">{product.price}</p>
              <button
                onClick={() => alert(`Anda memilih: ${product.name}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Beli Sekarang
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PelangganJB;
