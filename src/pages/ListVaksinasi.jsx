// src/pages/ListVaksinasi.jsx
import { useEffect, useState } from 'react';
import { supabase } from "../supabase"; // Pastikan path import ini benar

function ListVaksinasi() {
  const [vaksinasi, setVaksinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVaksinasi = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('vaksinasi')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching vaksinasi:', error);
      setError('Gagal mengambil data vaksinasi. Silakan coba lagi.');
    } else {
      setVaksinasi(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, currentStatus) => {
    // Menentukan status berikutnya berdasarkan status saat ini
    const nextStatus =
      currentStatus === 'Pending'
        ? 'Diterima'
        : currentStatus === 'Diterima'
        ? 'Ditolak'
        : 'Pending';

    const { error } = await supabase
      .from('vaksinasi')
      .update({ status: nextStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Gagal memperbarui status: ' + error.message);
    }
    // TIDAK perlu fetch ulang di sini karena Realtime akan menangani pembaruan UI secara otomatis.
  };

  const deleteVaksinasi = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }
    const { error } = await supabase.from('vaksinasi').delete().eq('id', id);

    if (error) {
      console.error('Error deleting vaksinasi:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // TIDAK perlu fetch ulang di sini karena Realtime akan menangani pembaruan UI secara otomatis.
  };

  useEffect(() => {
    fetchVaksinasi(); // Panggil saat komponen pertama kali di-mount untuk memuat data awal

    // Supabase Realtime Subscription
    // Berlangganan perubahan pada tabel 'vaksinasi'
    // Pastikan Anda telah mengaktifkan 'Realtime' untuk tabel 'vaksinasi'
    // di dashboard Supabase Anda (Database -> Replication -> Add new replication publication).
    const channel = supabase
      .channel('public:vaksinasi') // Nama channel unik untuk tabel ini
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vaksinasi' }, payload => {
        console.log('Perubahan Realtime diterima (vaksinasi):', payload);
        // Setiap kali ada perubahan (INSERT, UPDATE, DELETE), ambil ulang data terbaru
        fetchVaksinasi();
      })
      .subscribe(); // Jangan lupa untuk subscribe!

    // Cleanup function: Penting untuk menghentikan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Data Vaksinasi Hewan
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

      {!loading && !error && vaksinasi.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Info:</strong>
          <span className="block sm:inline"> Tidak ada data vaksinasi yang tersedia.</span>
        </div>
      )}

      {!loading && !error && vaksinasi.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-blue-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-tl-xl">Nama Hewan</th>
                <th className="py-3 px-4">Jenis Hewan</th>
                <th className="py-3 px-4">Jenis Vaksin</th>
                <th className="py-3 px-4">Jam Vaksin</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vaksinasi.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                  {/* Pastikan nama properti item cocok dengan nama kolom di DB Supabase */}
                  <td className="py-2 px-4">{item.nama_hewan}</td>
                  <td className="py-2 px-4">{item.jenis_hewan}</td>
                  <td className="py-2 px-4">{item.jenis_vaksin}</td>
                  <td className="py-2 px-4">{item.jam_vaksin}</td>
                  <td className="py-2 px-4">{item.tanggal ? new Date(item.tanggal).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                        item.status === 'Diterima'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Ditolak'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => updateStatus(item.id, item.status)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150 py-1 px-2 rounded hover:bg-blue-100"
                      title="Ganti Status"
                    >
                      Ganti Status
                    </button>
                    <button
                      onClick={() => deleteVaksinasi(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors duration-150 py-1 px-2 rounded hover:bg-red-100"
                      title="Hapus Data"
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
  );
}

export default ListVaksinasi;