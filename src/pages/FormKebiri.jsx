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

  const [loadingFormSubmit, setLoadingFormSubmit] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Ambil username dari localStorage (jika ini yang Anda gunakan untuk identifikasi user)
  const username = localStorage.getItem('username') || 'anon_user';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold">
          Form Kebiri Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-md mb-4 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label htmlFor="namaHewan" className="block mb-1 text-gray-700 font-semibold">Nama Hewan</label>
            <input
              id="namaHewan"
              name="namaHewan"
              type="text"
              placeholder="Contoh: Meong"
              value={form.namaHewan}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="jenisHewan" className="block mb-1 text-gray-700 font-semibold">Jenis Hewan</label>
            <input
              id="jenisHewan"
              name="jenisHewan"
              type="text"
              placeholder="Contoh: Kucing, Anjing"
              value={form.jenisHewan}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="namaPemilik" className="block mb-1 text-gray-700 font-semibold">Nama Pemilik</label>
            <input
              id="namaPemilik"
              name="namaPemilik"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={form.namaPemilik}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="jenisKelamin" className="block mb-1 text-gray-700 font-semibold">Jenis Kelamin</label>
            <select
              id="jenisKelamin"
              name="jenisKelamin"
              value={form.jenisKelamin}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-gray-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            >
              <option value="" disabled hidden>
                Pilih Jenis Kelamin
              </option>
              <option value="Jantan">Jantan</option>
              <option value="Betina">Betina</option>
            </select>
          </div>

          <div>
            <label htmlFor="usia" className="block mb-1 text-gray-700 font-semibold">Usia (bulan)</label>
            <input
              id="usia"
              name="usia"
              type="number"
              placeholder="Contoh: 6"
              value={form.usia}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              min="0"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="tanggal" className="block mb-1 text-gray-700 font-semibold">Tanggal</label>
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="jam" className="block mb-1 text-gray-700 font-semibold">Jam</label>
              <input
                id="jam"
                name="jam"
                type="time"
                value={form.jam}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingFormSubmit}
          >
            {loadingFormSubmit ? 'Mengirim...' : 'Kirim Reservasi Kebiri'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormKebiri;