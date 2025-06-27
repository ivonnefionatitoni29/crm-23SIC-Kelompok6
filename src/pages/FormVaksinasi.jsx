import React, { useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path import ini benar

const FormVaksinasi = () => {
  const [form, setForm] = useState({
    nama_hewan: '',
    jenis_hewan: '',
    jenis_vaksin: '',
    jam_vaksin: '',
    tanggal: '',
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

    const newData = {
      nama_hewan: form.nama_hewan,
      jenis_hewan: form.jenis_hewan,
      jenis_vaksin: form.jenis_vaksin,
      jam_vaksin: form.jam_vaksin,
      tanggal: form.tanggal,
      status: 'Pending',
    };

    const { error } = await supabase.from('vaksinasi').insert([newData]);

    if (error) {
      console.error('Error inserting data:', error);
      setSubmitMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim reservasi vaksinasi: ' + error.message });
    } else {
      console.log('Data vaksinasi inserted successfully.');
      setSubmitMessage({ type: 'success', text: 'Reservasi vaksinasi berhasil dikirim!' });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold">
          Form Vaksinasi Hewan
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-md mb-4 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label htmlFor="nama_hewan" className="block mb-1 text-gray-700 font-semibold">Nama Hewan</label>
            <input
              id="nama_hewan"
              name="nama_hewan"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.nama_hewan}
              onChange={handleChange}
              placeholder="Contoh: Snowy"
              required
            />
          </div>
          <div>
            <label htmlFor="jenis_hewan" className="block mb-1 text-gray-700 font-semibold">Jenis Hewan</label>
            <input
              id="jenis_hewan"
              name="jenis_hewan"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.jenis_hewan}
              onChange={handleChange}
              placeholder="Contoh: Kucing, Anjing"
              required
            />
          </div>
          <div>
            <label htmlFor="jenis_vaksin" className="block mb-1 text-gray-700 font-semibold">Jenis Vaksin</label>
            <input
              id="jenis_vaksin"
              name="jenis_vaksin"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.jenis_vaksin}
              onChange={handleChange}
              placeholder="Contoh: Rabies, Feline Panleukopenia"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="jam_vaksin" className="block mb-1 text-gray-700 font-semibold">Jam Vaksin</label>
              <input
                id="jam_vaksin"
                name="jam_vaksin"
                type="time"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.jam_vaksin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="tanggal" className="block mb-1 text-gray-700 font-semibold">Tanggal Vaksin</label>
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Reservasi Vaksinasi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormVaksinasi;