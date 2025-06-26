// src/pages/AdminKebiri.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // PASTIKAN PATH INI BENAR KE FILE SUPABASE.JS ANDA

export default function AdminKebiri() {
  const [dataKebiri, setDataKebiri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const fetchDataKebiri = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('kebiri') // Mengambil data dari tabel 'kebiri'
      .select('*')
      .order('created_at', { ascending: false }); // Mengurutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching data kebiri:', error);
      setError('Gagal mengambil data kebiri. Silakan coba lagi.');
    } else {
      setDataKebiri(data);
    }
    setLoading(false);
  };

  // Fungsi untuk menghapus data dari Supabase
  const handleDelete = async (id) => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('kebiri')
      .delete()
      .eq('id', id); // Menghapus baris berdasarkan ID

    if (error) {
      console.error('Error deleting data:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // Realtime Supabase akan secara otomatis memperbarui UI setelah ini.
  };

  // useEffect untuk memuat data awal dan berlangganan perubahan Realtime
  useEffect(() => {
    fetchDataKebiri(); // Ambil data saat komponen pertama kali dimuat

    // Supabase Realtime Subscription
    // Pastikan Anda telah mengaktifkan 'Realtime' untuk tabel 'kebiri' di dashboard Supabase.
    const channel = supabase
      .channel('public:kebiri_admin_changes') // Nama channel unik untuk admin view
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kebiri' }, payload => {
        console.log('Perubahan Realtime diterima (AdminKebiri):', payload);
        fetchDataKebiri(); // Ambil ulang data setiap ada perubahan (insert, update, delete)
      })
      .subscribe(); // Penting: Jangan lupa subscribe!

    // Cleanup function: Hentikan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen Data Kebiri Hewan
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

        {!loading && !error && dataKebiri.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada data reservasi kebiri.</span>
          </div>
        )}

        {!loading && !error && dataKebiri.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jenis</th>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Pemilik</th>
                  <th className="px-4 py-2 text-left text-blue-800">Kelamin</th>
                  <th className="px-4 py-2 text-left text-blue-800">Usia</th>
                  <th className="px-4 py-2 text-left text-blue-800">Tanggal</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jam</th>
                  {/* KOLOM STATUS DIHAPUS */}
                  <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {dataKebiri.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{item.nama_hewan}</td>
                    <td className="px-4 py-2">{item.jenis_hewan}</td>
                    <td className="px-4 py-2">{item.nama_pemilik}</td>
                    <td className="px-4 py-2">{item.jenis_kelamin}</td>
                    <td className="px-4 py-2">{item.usia} bln</td>
                    <td className="px-4 py-2">{item.tanggal ? new Date(item.tanggal).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">{item.jam}</td>
                    {/* DATA STATUS DIHAPUS */}
                    <td className="px-4 py-2 text-center space-x-2">
                      {/* TOMBOL "UBAH STATUS" DIHAPUS */}
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition">
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