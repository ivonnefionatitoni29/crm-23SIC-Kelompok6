import React, { useState } from "react";

export default function RekapPembelian() {
  const [dataPembelian, setDataPembelian] = useState([]);
  const [formData, setFormData] = useState({
    namaItem: "",
    jenis: "Makanan",
    tanggal: "",
    harga: "",
    jumlah: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTambah = () => {
    const { namaItem, jenis, tanggal, harga, jumlah } = formData;
    if (!namaItem || !jenis || !tanggal || !harga || !jumlah) {
      alert("Mohon lengkapi semua data pembelian!");
      return;
    }

    const total = parseFloat(harga) * parseInt(jumlah);

    setDataPembelian((prev) => [
      ...prev,
      {
        id: Date.now(),
        namaItem,
        jenis,
        tanggal,
        harga: parseFloat(harga),
        jumlah: parseInt(jumlah),
        total,
      },
    ]);

    setFormData({
      namaItem: "",
      jenis: "Makanan",
      tanggal: "",
      harga: "",
      jumlah: "",
    });
  };

  const handleHapus = (id) => {
    setDataPembelian(dataPembelian.filter((item) => item.id !== id));
  };

  const totalKeseluruhan = dataPembelian.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rekapan Pembelian Makanan & Obat Hewan</h1>

      {/* Form Input */}
      <div className="mb-6 p-4 bg-white border rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Nama Item</label>
            <input
              type="text"
              name="namaItem"
              value={formData.namaItem}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Contoh: Obat Cacing"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Jenis</label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Makanan">Makanan</option>
              <option value="Obat">Obat</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Tanggal Pembelian</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Harga (Rp)</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Jumlah</label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleTambah}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tambah ke Rekapan
        </button>
      </div>

      {/* Tabel Rekapan */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nama Item</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Harga (Rp)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Jumlah</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Total (Rp)</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataPembelian.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.namaItem}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2 text-right">Rp {item.harga.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{item.jumlah}</td>
                <td className="px-4 py-2 text-right font-semibold">Rp {item.total.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleHapus(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {dataPembelian.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Belum ada data pembelian.
                </td>
              </tr>
            )}
          </tbody>
          {dataPembelian.length > 0 && (
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={6} className="px-4 py-2 text-right font-bold">
                  Total Keseluruhan:
                </td>
                <td className="px-4 py-2 text-right font-bold text-green-700">
                  Rp {totalKeseluruhan.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
