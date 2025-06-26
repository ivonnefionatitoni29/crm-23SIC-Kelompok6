// src/pages/PetBoardingManagement.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Pastikan path import ini benar

export default function PetBoardingManagement() {
  const [dataPenitipan, setDataPenitipan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const fetchDataPenitipan = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('penitipan')
      .select('*')
      .order('created_at', { ascending: false }); // Mengurutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching data penitipan:', error);
      setError('Gagal mengambil data penitipan. Silakan coba lagi.');
    } else {
      setDataPenitipan(data);
    }
    setLoading(false);
  };

  // Fungsi untuk menghapus data dari Supabase
  const handleDelete = async (id) => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('penitipan')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting data:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // Realtime Supabase akan secara otomatis memperbarui UI setelah ini.
  };

  useEffect(() => {
    fetchDataPenitipan();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('public:penitipan_changes') // Nama channel unik
      .on('postgres_changes', { event: '*', schema: 'public', table: 'penitipan' }, payload => {
        console.log('Perubahan Realtime diterima (penitipan):', payload);
        fetchDataPenitipan(); // Ambil ulang data setiap ada perubahan
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen Penitipan Hewan
        </h1>

        {loading && (
          <p className="text-center text-lg text-blue-600">Memuat data...</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && dataPenitipan.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada data penitipan.</span>
          </div>
        )}

        {!loading && !error && dataPenitipan.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jenis Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Ras</th>
                  <th className="px-4 py-2 text-left text-blue-800">Pemilik</th>
                  <th className="px-4 py-2 text-left text-blue-800">Check-in</th>
                  <th className="px-4 py-2 text-left text-blue-800">Check-out</th>
                  {/* KOLOM STATUS DIHAPUS */}
                  <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {dataPenitipan.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    {/* PASTIKAN NAMA PROPERTI item SESUAI DENGAN NAMA KOLOM DI DATABASE (snake_case) */}
                    <td className="px-4 py-2">{item.nama_hewan}</td>
                    <td className="px-4 py-2">{item.jenis_hewan}</td>
                    <td className="px-4 py-2">{item.ras}</td>
                    <td className="px-4 py-2">{item.pemilik}</td>
                    <td className="px-4 py-2">
                        {item.check_in ? new Date(item.check_in).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2">
                        {item.check_out ? new Date(item.check_out).toLocaleDateString() : '-'}
                    </td>
                    {/* DATA STATUS DIHAPUS */}
                    <td className="px-4 py-2 text-center space-x-2">
                      {/* TOMBOL "UBAH STATUS" DIHAPUS */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}