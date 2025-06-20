// src/pages/FormKebiri.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // PASTIKAN PATH INI BENAR

const FormKebiri = () => {
  const [form, setForm] = useState({
    namaHewan: '',
    jenisHewan: '',
    namaPemilik: '',
    jenisKelamin: '',
    usia: '',
    tanggal: '',
    jam: '',
  });

  // State dan fungsi terkait data reservasi pengguna tidak diperlukan lagi jika tabel dihapus
  // const [dataUserReservasi, setDataUserReservasi] = useState([]);
  // const [loadingReservasiList, setLoadingReservasiList] = useState(true);
  // const [fetchError, setFetchError] = useState(null);

  const [loadingFormSubmit, setLoadingFormSubmit] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Ambil username dari localStorage (jika ini yang Anda gunakan untuk identifikasi user)
  const username = localStorage.getItem('username') || 'anon_user';

  // Fungsi untuk mengambil data reservasi kebiri dari Supabase (tidak lagi dipanggil jika tabel dihapus)
  // const fetchUserReservations = async () => {
  //   setLoadingReservasiList(true);
  //   setFetchError(null);
  //   const { data, error } = await supabase
  //     .from('kebiri')
  //     .select('*')
  //     .eq('pemilik', username)
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     console.error('Error fetching user reservations:', error);
  //     setFetchError('Gagal memuat data reservasi Anda.');
  //   } else {
  //     setDataUserReservasi(data);
  //   }
  //   setLoadingReservasiList(false);
  // };

  // useEffect untuk memuat data awal dan berlangganan perubahan Realtime (tidak diperlukan jika tabel dihapus)
  // useEffect(() => {
  //   // fetchUserReservations(); // Tidak perlu panggil ini lagi

  //   // const channel = supabase
  //   //   .channel('public:kebiri_user_reservations')
  //   //   .on(
  //   //     'postgres_changes',
  //   //     {
  //   //       event: '*',
  //   //       schema: 'public',
  //   //       table: 'kebiri',
  //   //       filter: `pemilik=eq.${username}`,
  //   //     },
  //   //     (payload) => {
  //   //       console.log('Realtime change received for user reservations:', payload);
  //   //       // fetchUserReservations(); // Tidak perlu panggil ini lagi
  //   //     }
  //   //   )
  //   //   .subscribe();

  //   // return () => {
  //   //   // supabase.removeChannel(channel); // Tidak perlu remove channel ini lagi
  //   // };
  // }, [username]); // Dependensi username

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingFormSubmit(true);
    setSubmitMessage(null);

    const newData = {
      nama_hewan: form.namaHewan,
      jenis_hewan: form.jenisHewan,
      nama_pemilik: form.namaPemilik,
      jenis_kelamin: form.jenisKelamin,
      usia: parseInt(form.usia, 10),
      tanggal: form.tanggal,
      jam: form.jam,
      pemilik: username,
      status: 'Pending',
    };

    const { error } = await supabase.from('kebiri').insert([newData]);

    if (error) {
      console.error('Error inserting data:', error);
      setSubmitMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim reservasi: ' + error.message });
    } else {
      console.log('Data kebiri inserted successfully.');
      setSubmitMessage({ type: 'success', text: 'Reservasi kebiri berhasil dikirim!' });
      // Reset form
      setForm({
        namaHewan: '',
        namaPemilik: '',
        jenisHewan: '',
        jenisKelamin: '',
        usia: '',
        tanggal: '',
        jam: '',
      });
    }
    setLoadingFormSubmit(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-xl font-semibold">
          Form Kebiri Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-md mb-4 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <label className="block text-gray-700 font-semibold mb-1">Nama Hewan</label>
          <input name="namaHewan" placeholder="Nama Hewan" value={form.namaHewan} onChange={handleChange} required className="w-full p-2 border rounded" />

          <label className="block text-gray-700 font-semibold mb-1">Jenis Hewan</label>
          <input name="jenisHewan" placeholder="Jenis Hewan" value={form.jenisHewan} onChange={handleChange} required className="w-full p-2 border rounded" />

          <label className="block text-gray-700 font-semibold mb-1">Nama Pemilik</label>
          <input name="namaPemilik" placeholder="Nama Pemilik" value={form.namaPemilik} onChange={handleChange} required className="w-full p-2 border rounded" />

          <label className="block text-gray-700 font-semibold mb-1">Jenis Kelamin</label>
          <select name="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Jantan">Jantan</option>
            <option value="Betina">Betina</option>
          </select>

          <label className="block text-gray-700 font-semibold mb-1">Usia (bulan)</label>
          <input name="usia" placeholder="Usia (bulan)" type="number" value={form.usia} onChange={handleChange} required className="w-full p-2 border rounded" min="0" />

          <label className="block text-gray-700 font-semibold mb-1">Tanggal</label>
          <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required className="w-full p-2 border rounded" />

          <label className="block text-gray-700 font-semibold mb-1">Jam</label>
          <input name="jam" type="time" value={form.jam} onChange={handleChange} required className="w-full p-2 border rounded" />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingFormSubmit}
          >
            {loadingFormSubmit ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>

      {/* Bagian div tabel "Data Reservasi Saya" telah dihapus dari sini */}
    </div>
  );
};

export default FormKebiri;