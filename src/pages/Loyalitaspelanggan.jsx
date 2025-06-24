import React, { useState, useEffect } from "react";
import { Crown, BarChart2, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { supabase } from '../supabase'; // Pastikan path ini benar

export default function RekapLoyalitas() {
  const [dataLoyalitas, setDataLoyalitas] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' untuk poin tertinggi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memuat data dari Supabase saat komponen pertama kali dirender atau saat sortOrder berubah
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('dataloyalitas')
        .select('*, users(nama)') // Mengambil semua kolom dari dataloyalitas dan nama dari tabel users
        .order('poinloyalitas', { ascending: sortOrder === 'asc' });

      console.log(data)

      if (error) {
        console.error("Error fetching loyalty data:", error);
        setError("Gagal memuat data loyalitas.");
        setDataLoyalitas([]);
      } else {
        // Mapping nama kolom dari Supabase ke nama yang digunakan di komponen
        // Pastikan 'users' adalah nama relasi Anda di Supabase dan 'nama' adalah kolom nama pelanggan di tabel 'users'
        const formattedData = data.map(item => ({
          id: item.id,
          namaPelanggan: item.users ? item.users.nama : 'Nama Tidak Ditemukan', // Mengambil nama dari objek users yang direlasikan
          poinLoyalitas: item.poinloyalitas,
          totalBelanja: item.totalbelanja,
          jumlahTransaksi: item.jumlahtransaksi,
        }));
        setDataLoyalitas(formattedData);
      }
      setLoading(false);
    };

    fetchLoyaltyData();
  }, [sortOrder]); // Dependensi: setiap kali sortOrder berubah, data akan di-fetch ulang

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "desc" ? "asc" : "desc"));
    // Logika sorting akan ditangani oleh useEffect karena sortOrder berubah
  };

  const handleDelete = async (idToDelete) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data loyalitas pelanggan ini?")) {
      return;
    }
    const { error } = await supabase
      .from('dataloyalitas')
      .delete()
      .eq('id', idToDelete); // Hapus berdasarkan ID pelanggan

    if (error) {
      console.error("Error deleting loyalty data:", error);
      alert("Gagal menghapus data loyalitas: " + error.message);
    } else {
      // Perbarui state secara lokal untuk refleksi cepat di UI
      setDataLoyalitas((prevData) => prevData.filter(item => item.id !== idToDelete));
      alert("Data loyalitas berhasil dihapus!");
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

        {loading && <p className="text-center text-blue-500">Memuat data loyalitas...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Peringkat</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nama Pelanggan</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Poin Loyalitas</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total Belanja</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Jumlah Transaksi</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Aksi</th>
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
                      {/* Menampilkan nama pelanggan */}
                      <td className="px-4 py-3 font-medium text-gray-900">{item.namaPelanggan}</td>
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
                  <tr>
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
        )}
      </div>
    </div>
  );
}