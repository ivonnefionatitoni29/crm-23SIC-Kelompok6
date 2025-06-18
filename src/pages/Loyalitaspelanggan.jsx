import React, { useState, useEffect } from "react";
import { Crown, BarChart2, TrendingUp, TrendingDown, Trash2 } from "lucide-react"; // Import Trash2 icon

export default function RekapLoyalitas() {
  const [dataLoyalitas, setDataLoyalitas] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' untuk poin tertinggi

  // Memuat data dari localStorage saat komponen pertama kali dirender
  useEffect(() => {
    try {
      const savedData = JSON.parse(localStorage.getItem("dataLoyalitas")) || [];
      // Urutkan data berdasarkan poin secara default
      const sortedData = [...savedData].sort((a, b) => b.poinLoyalitas - a.poinLoyalitas);
      setDataLoyalitas(sortedData);
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setDataLoyalitas([]); // Fallback to empty array
    }
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    const sortedData = [...dataLoyalitas].sort((a, b) => {
      if (newSortOrder === 'desc') {
        return b.poinLoyalitas - a.poinLoyalitas;
      }
      return a.poinLoyalitas - b.poinLoyalitas;
    });
    setDataLoyalitas(sortedData);
  };

  const handleDelete = (idToDelete) => {
    const updatedData = dataLoyalitas.filter(item => item.id !== idToDelete);
    setDataLoyalitas(updatedData);
    try {
      localStorage.setItem("dataLoyalitas", JSON.stringify(updatedData)); // Update localStorage
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Crown className="mr-3 text-yellow-500" />
            Rekapitulasi Loyalitas Pelanggan
          </h1>
          <button
            onClick={handleSort}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {sortOrder === "desc" ? (
              <TrendingDown className="mr-2 h-4 w-4" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            Urutkan Poin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Peringkat</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Pelanggan</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nomor Telepon</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Poin Loyalitas</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Total Belanja</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Jumlah Transaksi</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th> {/* New column for actions */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dataLoyalitas.length > 0 ? (
                dataLoyalitas.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-lg ${index < 3 ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.namaPelanggan}</td>
                    <td className="px-4 py-3 text-gray-700">{item.id}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">{item.poinLoyalitas.toLocaleString()} Poin</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatRupiah(item.totalBelanja)}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{item.jumlahTransaksi} kali</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        title="Hapus Pelanggan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr> {/* This is the corrected structure for the "no data" row */}
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Belum ada data loyalitas pelanggan.</p>
                    <p className="text-sm">Data akan muncul setelah ada transaksi pertama.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}