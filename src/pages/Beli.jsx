import React from 'react';
import amox from '../assets/amox.jpeg';
import canin from '../assets/canin.jpeg';
import nutrisi from '../assets/nutrisi.jpeg';

const Dashboard = () => {
  // Data produk makanan dan obat hewan
  const products = [
    {
      id: 1,
      name: 'Royal Canin Recovery (Makanan Anjing/Kucing)',
      price: 95000,
      image: canin,
    },
    {
      id: 2,
      name: 'Nutriplus Gel (Suplemen Hewan)',
      price: 120000,
      image: nutrisi,
    },
    {
      id: 3,
      name: 'Antibiotik Amoxicillin 250mg (Hewan)',
      price: 30000,
      image: amox,
    },
    {
      id: 4,
      name: 'Whiskas Dry Food 1.2kg',
      price: 70000,
      image: canin,
    },
       {
      id: 1,
      name: 'Royal Canin Recovery (Makanan Anjing/Kucing)',
      price: 95000,
      image: canin,
    },
    {
      id: 2,
      name: 'Nutriplus Gel (Suplemen Hewan)',
      price: 120000,
      image: nutrisi,
    },
    {
      id: 3,
      name: 'Antibiotik Amoxicillin 250mg (Hewan)',
      price: 30000,
      image: amox,
    },
    {
      id: 4,
      name: 'Whiskas Dry Food 1.2kg',
      price: 70000,
      image: canin,
    },
    // Tambahkan produk lainnya di sini jika perlu
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Jual Beli Makanan & Obat Klinik Hewan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded-xl overflow-hidden transition hover:shadow-lg flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-green-600 font-bold text-xl mt-2">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <div className="mt-auto">
                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
