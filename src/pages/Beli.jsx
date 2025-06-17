import React, { useState, useEffect } from "react";

export default function RekapPembelian() {
  const [dataPembelian, setDataPembelian] = useState([]);

  // useEffect untuk memuat data dari localStorage saat komponen pertama kali dirender
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("dataPembelian")) || [];
    setDataPembelian(savedData);
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali

  const handleHapus = (id) => {
    // Filter data di state
    const newData = dataPembelian.filter((item) => item.id !== id);
    setDataPembelian(newData);

    // Update juga data di localStorage
    localStorage.setItem("dataPembelian", JSON.stringify(newData));
  };

  const totalKeseluruhan = dataPembelian.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Rekapan Pembelian Makanan & Obat Hewan
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama Item</th>
                <th className="px-4 py-2 text-left">Jenis</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Nama Pelanggan</th> {/* Kolom Baru */}
                <th className="px-4 py-2 text-right">Harga (Rp)</th>
                <th className="px-4 py-2 text-right">Jumlah</th>
                <th className="px-4 py-2 text-right">Total (Rp)</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataPembelian.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.namaItem}</td>
                  <td className="px-4 py-2">{item.jenis}</td>
                  <td className="px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2">{item.pelanggan?.nama || 'N/A'}</td> {/* Tampilkan nama pelanggan */}
                  <td className="px-4 py-2 text-right">
                    Rp {item.harga.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">{item.jumlah}</td>
                  <td className="px-4 py-2 text-right font-medium">
                    Rp {item.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleHapus(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {dataPembelian.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Tidak ada data pembelian.
                  </td>
                </tr>
              )}
            </tbody>
            {dataPembelian.length > 0 && (
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-right font-bold">
                    Total Keseluruhan:
                  </td>
                  <td className="px-4 py-2 text-right font-bold text-green-700">
                    Rp {totalKeseluruhan.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}