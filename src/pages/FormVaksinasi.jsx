// src/pages/FormVaksinasi.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path import ini benar

const FormVaksinasi = () => {
  const [form, setForm] = useState({
    nama_hewan: '', // Diubah agar sesuai dengan nama kolom di DB
    jenis_hewan: '', // Diubah agar sesuai dengan nama kolom di DB
    jenis_vaksin: '', // Diubah agar sesuai dengan nama kolom di DB
    jam_vaksin: '', // Diubah agar sesuai dengan nama kolom di DB
    tanggal: '', // Diubah agar sesuai dengan nama kolom di DB
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);

    // Data yang akan dimasukkan ke Supabase
    // PASTIKAN NAMA KEY SAMA DENGAN NAMA KOLOM DI DATABASE SUPABASE ANDA
    const newData = {
      nama_hewan: form.nama_hewan,
      jenis_hewan: form.jenis_hewan,
      jenis_vaksin: form.jenis_vaksin,
      jam_vaksin: form.jam_vaksin,
      tanggal: form.tanggal,
      status: 'Pending', // Status awal saat reservasi dibuat
      // created_at akan otomatis diisi oleh Supabase jika kolom diatur dengan `now()`
    };

    const { error } = await supabase.from('vaksinasi').insert([newData]);

    if (error) {
      console.error('Error inserting data:', error);
      setSubmitMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim reservasi vaksinasi: ' + error.message });
    } else {
      console.log('Data vaksinasi inserted successfully.');
      setSubmitMessage({ type: 'success', text: 'Reservasi vaksinasi berhasil dikirim!' });
      // Reset form setelah berhasil submit
      setForm({
        nama_hewan: '',
        jenis_hewan: '',
        jenis_vaksin: '',
        jam_vaksin: '',
        tanggal: '',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-xl font-semibold">
          Form Vaksinasi Hewan
        </div>
        <div className="px-6 pt-4 pb-2 text-gray-700 text-sm">
          Silakan isi form vaksinasi hewan dengan lengkap. Setelah dikirim, reservasi Anda akan diproses oleh admin.
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-md mb-4 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label htmlFor="nama_hewan" className="block mb-1 font-medium">Nama Hewan</label>
            <input
              id="nama_hewan"
              name="nama_hewan" // Ubah name sesuai nama kolom di DB
              className="w-full p-2 border rounded"
              value={form.nama_hewan}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="jenis_hewan" className="block mb-1 font-medium">Jenis Hewan</label>
            <input
              id="jenis_hewan"
              name="jenis_hewan" // Ubah name sesuai nama kolom di DB
              className="w-full p-2 border rounded"
              value={form.jenis_hewan}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="jenis_vaksin" className="block mb-1 font-medium">Jenis Vaksin</label>
            <input
              id="jenis_vaksin"
              name="jenis_vaksin" // Ubah name sesuai nama kolom di DB
              className="w-full p-2 border rounded"
              value={form.jenis_vaksin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="jam_vaksin" className="block mb-1 font-medium">Jam Vaksin</label>
              <input
                id="jam_vaksin"
                name="jam_vaksin" // Ubah name sesuai nama kolom di DB
                type="time"
                className="w-full p-2 border rounded"
                value={form.jam_vaksin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="tanggal" className="block mb-1 font-medium">Tanggal Vaksin</label>
              <input
                id="tanggal"
                name="tanggal" // Ubah name sesuai nama kolom di DB
                type="date"
                className="w-full p-2 border rounded"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>
      {/* Bagian tabel data vaksinasi di FormVaksinasi dihapus.
          Data vaksinasi akan ditampilkan dan dikelola sepenuhnya oleh komponen ListVaksinasi. */}
    </div>
  );
};

export default FormVaksinasi;