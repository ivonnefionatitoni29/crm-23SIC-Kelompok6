// src/pages/UserTable.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // PASTIKAN PATH INI BENAR DAN AKURAT UNTUK FILE SUPABASE CLIENT ANDA

function UserTable() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data pengguna dari tabel 'users'
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('users') // Mengambil data dari tabel 'users'
      .select('*') // Mengambil semua kolom
      .order('created_at', { ascending: false }); // Mengurutkan berdasarkan waktu pendaftaran terbaru

    if (error) {
      console.error('Error fetching user data:', error);
      setError('Gagal mengambil data pengguna. Silakan coba lagi.');
    } else {
      setUserData(data);
    }
    setLoading(false);
  };

  // Fungsi untuk mengubah peran (role) pengguna
  const toggleUserRole = async (id, currentRole) => {
    // Logika sederhana: jika 'user', ubah jadi 'admin'; jika 'admin', ubah jadi 'user'.
    const nextRole = currentRole === 'user' ? 'admin' : 'user';

    // Konfirmasi sebelum mengubah role
    if (!window.confirm(`Apakah Anda yakin ingin mengubah peran pengguna menjadi "${nextRole}"?`)) {
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ role: nextRole })
      .eq('id', id); // Memperbarui baris berdasarkan ID pengguna

    if (error) {
      console.error('Error updating user role:', error);
      alert('Gagal memperbarui peran pengguna: ' + error.message);
    }
    // Realtime Supabase akan otomatis memperbarui UI setelah update berhasil,
    // jadi tidak perlu panggil fetchUserData() lagi secara manual di sini.
  };

  // Fungsi untuk menghapus pengguna
  const deleteUser = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }
    const { error } = await supabase.from('users').delete().eq('id', id); // Menghapus baris berdasarkan ID pengguna

    if (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus pengguna: ' + error.message);
    }
    // Realtime Supabase akan otomatis memperbarui UI setelah delete berhasil.
  };

  // useEffect untuk memuat data saat komponen dimuat dan berlangganan perubahan realtime
  useEffect(() => {
    fetchUserData();

    // Supabase Realtime Subscription
    // Pastikan Anda telah mengaktifkan 'Realtime' untuk tabel 'users' di dashboard Supabase.
    const channel = supabase
      .channel('public:users_changes') // Nama channel unik untuk tabel ini
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        console.log('Perubahan Realtime diterima (users):', payload);
        fetchUserData(); // Ambil ulang data setiap ada perubahan (insert, update, delete)
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
          Manajemen Data Pengguna
        </h2>

        {loading && (
          <p className="text-center text-lg text-blue-600">Memuat data pengguna...</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && userData.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada data pengguna.</span>
          </div>
        )}

        {!loading && !error && userData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-800">ID</th>
                  <th className="px-4 py-2 text-left text-blue-800">Nama</th>
                  <th className="px-4 py-2 text-left text-blue-800">Email</th>
                  <th className="px-4 py-2 text-left text-blue-800">Role</th>
                  <th className="px-4 py-2 text-left text-blue-800">Poin Loyalitas</th>
                  <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 bg-white">
                {userData.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50">
                    {/* PASTIKAN NAMA PROPERTI user SESUAI DENGAN NAMA KOLOM DI DATABASE */}
                    <td className="px-4 py-2 text-xs">{user.id}</td> {/* ID mungkin panjang, sesuaikan ukuran font */}
                    <td className="px-4 py-2">{user.nama || 'N/A'}</td>
                    <td className="px-4 py-2">{user.email || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role || 'user'} {/* Default ke 'user' jika role tidak ada */}
                      </span>
                    </td>
                    <td className="px-4 py-2">{user.loyalty_points || 0}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => toggleUserRole(user.id, user.role)}
                        className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 transition text-sm"
                      >
                        Ubah Role ({user.role === 'user' ? 'Admin' : 'User'})
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition text-sm"
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

export default UserTable;