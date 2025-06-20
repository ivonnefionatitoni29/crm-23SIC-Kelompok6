// src/pages/FormPenitipan.jsx
import React, { useState } from "react";
import { supabase } from "../supabase"; // PATH: Naik satu level ke 'src'

const FormPenitipan = () => {
  const [form, setForm] = useState({
    nama: "",
    usia: "",
    kelamin: "",
    jenis: "",
    ras: "",
    pemilik: "",
    checkIn: "", // Tetap camelCase di state form untuk kemudahan di React
    checkOut: "", // Tetap camelCase di state form
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
    // KUNCI DI SINI HARUS SAMA PERSIS DENGAN NAMA KOLOM DI DATABASE SUPABASE
    const newData = {
      nama_hewan: form.nama,
      usia: parseInt(form.usia, 10), // Pastikan usia adalah integer
      kelamin: form.kelamin, // Kolom ini sekarang ada di DB
      jenis_hewan: form.jenis,
      ras: form.ras,
      pemilik: form.pemilik,
      check_in: form.checkIn,   // UBAH: Menggunakan check_in (snake_case)
      check_out: form.checkOut, // UBAH: Menggunakan check_out (snake_case)
      status: "Pending", // Status awal saat reservasi dibuat
      // created_at akan otomatis diisi oleh Supabase jika kolom diatur dengan `now()`
    };

    const { error } = await supabase.from("penitipan").insert([newData]);

    if (error) {
      console.error("Error inserting data:", error);
      setSubmitMessage({ type: 'error', text: 'Terjadi kesalahan saat mengirim reservasi: ' + error.message });
    } else {
      console.log("Data inserted successfully.");
      setSubmitMessage({ type: 'success', text: 'Reservasi berhasil dikirim!' });
      // Reset form setelah berhasil submit
      setForm({
        nama: "",
        usia: "",
        kelamin: "",
        jenis: "",
        ras: "",
        pemilik: "",
        checkIn: "",
        checkOut: "",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold">
          Form Penitipan Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitMessage && (
            <div className={`px-4 py-3 rounded-md mb-4 ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div>
            <label htmlFor="nama" className="block mb-1 text-gray-700 font-semibold">Nama Hewan</label>
            <input
              id="nama"
              name="nama"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Miko"
              required
            />
          </div>

          <div>
            <label htmlFor="usia" className="block mb-1 text-gray-700 font-semibold">Usia (dalam bulan)</label>
            <input
              id="usia"
              name="usia"
              type="number"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.usia}
              onChange={handleChange}
              placeholder="Contoh: 12"
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="kelamin" className="block mb-1 text-gray-700 font-semibold">Jenis Kelamin</label>
            <select
              id="kelamin"
              name="kelamin"
              className="w-full p-2 border border-gray-300 rounded text-gray-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.kelamin}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Pilih Jenis Kelamin
              </option>
              <option value="Jantan">Jantan</option>
              <option value="Betina">Betina</option>
            </select>
          </div>

          <div>
            <label htmlFor="jenis" className="block mb-1 text-gray-700 font-semibold">Jenis Hewan</label>
            <input
              id="jenis"
              name="jenis"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.jenis}
              onChange={handleChange}
              placeholder="Contoh: Kucing, Anjing"
              required
            />
          </div>

          <div>
            <label htmlFor="ras" className="block mb-1 text-gray-700 font-semibold">Ras Hewan</label>
            <input
              id="ras"
              name="ras"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.ras}
              onChange={handleChange}
              placeholder="Contoh: Persia, Golden Retriever"
              required
            />
          </div>

          <div>
            <label htmlFor="pemilik" className="block mb-1 text-gray-700 font-semibold">Nama Pemilik</label>
            <input
              id="pemilik"
              name="pemilik"
              type="text"
              className="w-full p-2 border border-gray-300 rounded placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={form.pemilik}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="checkIn" className="block mb-1 text-gray-700 font-semibold">Tanggal Check-in</label>
              <input
                id="checkIn"
                name="checkIn"
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="checkOut" className="block mb-1 text-gray-700 font-semibold">Tanggal Check-out</label>
              <input
                id="checkOut"
                name="checkOut"
                type="date"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.checkOut}
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
            {loading ? 'Mengirim...' : 'Kirim Reservasi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPenitipan;