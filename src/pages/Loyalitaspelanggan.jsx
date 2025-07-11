import React, { useState, useEffect } from "react";
import { Crown, BarChart2, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from '../supabase';

export default function RekapLoyalitas() {
  const [dataLoyalitas, setDataLoyalitas] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('dataloyalitas')
        .select('*, users(nama)')
        .order('poinloyalitas', { ascending: sortOrder === 'asc' });

      if (error) {
        console.error("Error fetching loyalty data:", error);
        setError("Gagal memuat data loyalitas.");
        setDataLoyalitas([]);
      } else {
        const formattedData = data.map(item => ({
          id: item.id,
          namaPelanggan: item.users ? item.users.nama : 'Nama Tidak Ditemukan',
          poinLoyalitas: item.poinloyalitas,
          totalBelanja: item.totalbelanja,
          jumlahTransaksi: item.jumlahtransaksi,
        }));
        setDataLoyalitas(formattedData);
      }
      setLoading(false);
    };

    fetchLoyaltyData();
  }, [sortOrder]);

  const handleSort = () => {
    setSortOrder(prev => (prev === "desc" ? "asc" : "desc"));
  };

  const handleDelete = async (idToDelete) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data loyalitas pelanggan ini?")) return;

    const { error } = await supabase
      .from('dataloyalitas')
      .delete()
      .eq('id', idToDelete);

    if (error) {
      console.error("Error deleting loyalty data:", error);
      alert("Gagal menghapus data loyalitas: " + error.message);
    } else {
      setDataLoyalitas(prevData => prevData.filter(item => item.id !== idToDelete));
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
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-center mb-4">
  <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
    Loyalitas Pelanggan
  </h1>
</div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleSort}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {sortOrder === "desc" ? <TrendingDown className="mr-2 h-4 w-4" /> : <TrendingUp className="mr-2 h-4 w-4" />}
            Urutkan Poin
          </button>
        </div>

        {loading && <p className="text-center text-blue-600">Memuat data loyalitas...</p>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left text-blue-800">Peringkat</th>
                  <th className="px-4 py-3 text-left text-blue-800">Nama Pelanggan</th>
                  <th className="px-4 py-3 text-right text-blue-800">Poin Loyalitas</th>
                  <th className="px-4 py-3 text-right text-blue-800">Total Belanja</th>
                  <th className="px-4 py-3 text-center text-blue-800">Jumlah Transaksi</th>
                  <th className="px-4 py-3 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {dataLoyalitas.length > 0 ? (
                  dataLoyalitas.map((item, index) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="px-4 py-3 text-center font-bold text-blue-700">{index + 1}</td>
                      <td className="px-4 py-3 text-gray-800">{item.namaPelanggan}</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">{item.poinLoyalitas.toLocaleString()} Poin</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatRupiah(item.totalBelanja)}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{item.jumlahTransaksi} kali</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                      <BarChart2 className="mx-auto h-12 w-12 text-blue-300" />
                      <p className="mt-2 text-blue-600">Belum ada data loyalitas pelanggan.</p>
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
