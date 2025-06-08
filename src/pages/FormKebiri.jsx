import React, { useState } from 'react';

const FormKebiri = () => {
  const [form, setForm] = useState({
    namaHewan: '',
    jenis: '',
    pemilik: '',
    tanggalKebiri: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ambil data kebiri yang sudah ada dari localStorage
    const existingData = JSON.parse(localStorage.getItem('dataKebiri')) || [];

    // Tambahkan data baru ke array
    const newData = [...existingData, form];

    // Simpan kembali ke localStorage
    localStorage.setItem('dataKebiri', JSON.stringify(newData));

    alert('Data berhasil dikirim!');

    // Reset form
    setForm({
      namaHewan: '',
      jenis: '',
      pemilik: '',
      tanggalKebiri: '',
    });
  };

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-start py-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 text-xl font-semibold">
          Form Layanan Kebiri
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="namaHewan"
            placeholder="Nama Hewan"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.namaHewan}
            required
          />
          <input
            name="jenis"
            placeholder="Jenis Hewan"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.jenis}
            required
          />
          <input
            name="pemilik"
            placeholder="Nama Pemilik"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.pemilik}
            required
          />
          <input
            name="tanggalKebiri"
            type="date"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.tanggalKebiri}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormKebiri;
