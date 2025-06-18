import React, { useState, useEffect } from "react";
import { Crown, BarChart2, TrendingUp, TrendingDown } from "lucide-react";

export default function RekapLoyalitas() {
  const [dataLoyalitas, setDataLoyalitas] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("dataLoyalitas")) || [];
    const sortedData = [...savedData].sort((a, b) => b.poinLoyalitas - a.poinLoyalitas);
    setDataLoyalitas(sortedData);
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    const sortedData = [...dataLoyalitas].sort((a, b) => {
      return newSortOrder === "desc"
        ? b.poinLoyalitas - a.poinLoyalitas
        : a.poinLoyalitas - b.poinLoyalitas;
    });
    setDataLoyalitas(sortedData);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center">
            <Crown className="mr-3 text-blue-500" />
            Rekapitulasi Loyalitas Pelanggan
          </h1>
          <button
            onClick={handleSort}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Peringkat</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Nama Pelanggan</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Nomor Telepon</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700">Poin Loyalitas</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700">Total Belanja</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-700">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 bg-white">
              {dataLoyalitas.length > 0 ? (
                dataLoyalitas.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-lg ${index < 3 ? 'text-blue-700' : 'text-blue-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-900">{item.namaPelanggan}</td>
                    <td className="px-4 py-3 text-blue-700">{item.id}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700">{item.poinLoyalitas.toLocaleString()} Poin</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatRupiah(item.totalBelanja)}</td>
                    <td className="px-4 py-3 text-center text-blue-600">{item.jumlahTransaksi} kali</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-blue-400">
                    <BarChart2 className="mx-auto h-12 w-12 text-blue-300" />
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
