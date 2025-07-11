// src/pages/ListKebiri.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // PASTIKAN PATH INI BENAR

function ListKebiri() {
  const [kebiriData, setKebiriData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil username dari localStorage (jika Anda masih menggunakan ini untuk filter)
  const username = localStorage.getItem('username') || 'anon_user';

  const fetchKebiriData = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('kebiri') // Mengambil data dari tabel 'kebiri'
      .select('*')
      // Jika Anda ingin memfilter berdasarkan pemilik yang login, uncomment baris ini:
      // .eq('pemilik', username)
      .order('created_at', { ascending: false }); // Mengurutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching kebiri data:', error);
      setError('Gagal mengambil data kebiri. Silakan coba lagi.');
    } else {
      setKebiriData(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === 'Pending'
        ? 'Diterima'
        : currentStatus === 'Diterima'
        ? 'Ditolak'
        : 'Pending';

    const { error } = await supabase
      .from('kebiri')
      .update({ status: nextStatus })
      .eq('id', id); // Memperbarui baris berdasarkan ID

    if (error) {
      console.error('Error updating kebiri status:', error);
      alert('Gagal memperbarui status: ' + error.message);
    }
    // Realtime Supabase akan otomatis memperbarui UI, jadi tidak perlu panggil fetchKebiriData() lagi.
  };

  const deleteKebiri = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }
    const { error } = await supabase.from('kebiri').delete().eq('id', id); // Menghapus baris berdasarkan ID

    if (error) {
      console.error('Error deleting kebiri data:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // Realtime Supabase akan otomatis memperbarui UI.
  };

  useEffect(() => {
    fetchKebiriData();

    // Supabase Realtime Subscription
    // Pastikan Anda telah mengaktifkan 'Realtime' untuk tabel 'kebiri' di dashboard Supabase.
    const channel = supabase
      .channel('public:kebiri_changes') // Nama channel unik untuk tabel ini
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kebiri' }, payload => {
        console.log('Perubahan Realtime diterima (kebiri):', payload);
        fetchKebiriData(); // Ambil ulang data setiap ada perubahan (insert, update, delete)
      })
      .subscribe(); // Penting: Jangan lupa subscribe!

    // Cleanup function: Hentikan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Manajemen Reservasi Kebiri Hewan
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

        {!loading && !error && kebiriData.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada data reservasi kebiri.</span>
          </div>
        )}

        {!loading && !error && kebiriData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jenis Hewan</th>
                  <th className="px-4 py-2 text-left text-blue-800">Nama Pemilik</th>
                  <th className="px-4 py-2 text-left text-blue-800">Kelamin</th>
                  <th className="px-4 py-2 text-left text-blue-800">Usia</th>
                  <th className="px-4 py-2 text-left text-blue-800">Tanggal</th>
                  <th className="px-4 py-2 text-left text-blue-800">Jam</th>
                  <th className="px-4 py-2 text-center text-blue-800">Status</th>
                  <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {kebiriData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    {/* PASTIKAN NAMA PROPERTI item SESUAI DENGAN NAMA KOLOM DI DATABASE */}
                    <td className="px-4 py-2">{item.nama_hewan}</td>
                    <td className="px-4 py-2">{item.jenis_hewan}</td>
                    <td className="px-4 py-2">{item.nama_pemilik}</td>
                    <td className="px-4 py-2">{item.jenis_kelamin}</td>
                    <td className="px-4 py-2">{item.usia} bln</td>
                    <td className="px-4 py-2">{item.tanggal ? new Date(item.tanggal).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">{item.jam}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Diterima'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'Ditolak'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => updateStatus(item.id, item.status)}
                        className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
                      >
                        Ubah Status
                      </button>
                      <button
                        onClick={() => deleteKebiri(item.id)}
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

export default ListKebiri;