// src/pages/ListPenitipan.jsx
import { useEffect, useState } from 'react';
import { supabase } from "../supabase"; // PATH: Naik satu level ke 'src'

function ListPenitipan() {
  const [penitipan, setPenitipan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPenitipan = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('penitipan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching penitipan:', error);
      setError('Gagal mengambil data penitipan. Silakan coba lagi.');
    } else {
      setPenitipan(data);
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
      .from('penitipan')
      .update({ status: nextStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Gagal memperbarui status: ' + error.message);
    }
    // Realtime akan menangani pembaruan UI secara otomatis.
  };

  const deletePenitipan = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }
    const { error } = await supabase.from('penitipan').delete().eq('id', id);

    if (error) {
      console.error('Error deleting penitipan:', error);
      alert('Gagal menghapus data: ' + error.message);
    }
    // Realtime akan menangani pembaruan UI secara otomatis.
  };

  useEffect(() => {
    fetchPenitipan();

    const channel = supabase
      .channel('public:penitipan')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'penitipan' }, payload => {
        console.log('Realtime change received:', payload);
        fetchPenitipan(); // Ambil ulang data setiap ada perubahan
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Data Penitipan Hewan
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

      {!loading && !error && penitipan.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Info:</strong>
          <span className="block sm:inline"> Tidak ada data penitipan yang tersedia.</span>
        </div>
      )}

      {!loading && !error && penitipan.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-blue-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-tl-xl">Nama Hewan</th>
                <th className="py-3 px-4">Usia</th> {/* TAMBAHKAN KOLOM INI */}
                <th className="py-3 px-4">Kelamin</th> {/* TAMBAHKAN KOLOM INI */}
                <th className="py-3 px-4">Jenis Hewan</th>
                <th className="py-3 px-4">Ras Hewan</th>
                <th className="py-3 px-4">Pemilik</th>
                <th className="py-3 px-4">Check-in</th>
                <th className="py-3 px-4">Check-out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {penitipan.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="py-2 px-4">{item.nama_hewan}</td>
                  <td className="py-2 px-4">{item.usia} bln</td> {/* AKSES KOLOM BARU */}
                  <td className="py-2 px-4">{item.kelamin}</td> {/* AKSES KOLOM BARU */}
                  <td className="py-2 px-4">{item.jenis_hewan}</td>
                  <td className="py-2 px-4">{item.ras}</td>
                  <td className="py-2 px-4">{item.pemilik}</td>
                  <td className="py-2 px-4">{item.check_in ? new Date(item.check_in).toLocaleDateString() : '-'}</td>   {/* UBAH: Akses check_in (snake_case) dan format tanggal */}
                  <td className="py-2 px-4">{item.check_out ? new Date(item.check_out).toLocaleDateString() : '-'}</td> {/* UBAH: Akses check_out (snake_case) dan format tanggal */}
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
                      onClick={() => deletePenitipan(item.id)}
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

export default ListPenitipan;