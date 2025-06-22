// src/pages/VaccinationManagement.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Pastikan path import ini benar

const VaccinationManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const fetchDataVaksinasi = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('vaksinasi')
      .select('*')
      .order('created_at', { ascending: false }); // Mengurutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching data vaksinasi:', error);
      setError('Gagal mengambil data vaksinasi. Silakan coba lagi.');
    } else {
      setData(data);
    }
    setLoading(false);
  };

  // Fungsi untuk menghapus data dari Supabase
  const hapusData = async (id) => {
    const konfirmasi = confirm('Yakin ingin menghapus data ini?');
    if (!konfirmasi) return;

    const { error } = await supabase
      .from('vaksinasi')
      .delete()
      .eq('id', id); // Menghapus baris yang sesuai berdasarkan ID

    if (error) {
      console.error('Error deleting data:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // Realtime Supabase akan secara otomatis memperbarui UI setelah ini.
  };

  // useEffect untuk memuat data saat komponen di-mount dan berlangganan perubahan Realtime
  useEffect(() => {
    fetchDataVaksinasi();

    const channel = supabase
      .channel('public:vaksinasi_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vaksinasi' }, payload => {
        console.log('Perubahan Realtime diterima (vaksinasi):', payload);
        fetchDataVaksinasi();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Manajemen Vaksinasi Hewan
        </h2>

        {loading && (
          <p className="text-center text-lg text-blue-600">Memuat data...</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada data vaksinasi yang tersedia.</span>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jenis Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jenis Vaksin</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jam Vaksin</th>
                  <th className="px-4 py-2 text-left text-blue-800">Tanggal</th>
                  {/* KOLOM STATUS DIHAPUS */}
                  <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{item.nama_hewan}</td>
                    <td className="px-4 py-2">{item.jenis_hewan}</td>
                    <td className="px-4 py-2">{item.jenis_vaksin}</td>
                    <td className="px-4 py-2">{item.jam_vaksin}</td>
                    <td className="px-4 py-2">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString() : '-'}
                    </td>
                    {/* DATA STATUS DIHAPUS */}
                    <td className="px-4 py-2 text-center space-x-2">
                      {/* TOMBOL "UBAH STATUS" DIHAPUS */}
                      <button
                        onClick={() => hapusData(item.id)}
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
};

export default VaccinationManagement;