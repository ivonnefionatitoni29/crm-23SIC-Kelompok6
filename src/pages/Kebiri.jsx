import React, { useState } from "react";

export default function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaHewan: "",
    jenis: "",
    pemilik: "",
    tanggalKebiri: "",
    status: "Diterima",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSale = () => {
    const { namaHewan, jenis, pemilik, tanggalKebiri, status } = formData;
    if (!namaHewan || !jenis || !pemilik || !tanggalKebiri) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newSale = {
      id: Date.now(), // gunakan timestamp sebagai ID unik
      ...formData,
    };
    setSales([...sales, newSale]);
    setFormData({
      namaHewan: "",
      jenis: "",
      pemilik: "",
      tanggalKebiri: "",
      status: "Diterima",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus reservasi ini?")) {
      setSales(sales.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Reservasi Kebiri</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {showForm ? "Batal Reservasi Kebiri" : "Tambah Reservasi"}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded shadow-sm bg-white">
          <div className="mb-2">
            <label className="block font-medium mb-1">Nama Hewan</label>
            <input
              type="text"
              name="namaHewan"
              value={formData.namaHewan}
              onChange={handleInputChange}
              placeholder="Misal: Kucing"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Jenis</label>
            <input
              type="text"
              name="jenis"
              value={formData.jenis}
              onChange={handleInputChange}
              placeholder="Misal: Anggora"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Pemilik</label>
            <input
              type="text"
              name="pemilik"
              value={formData.pemilik}
              onChange={handleInputChange}
              placeholder="Masukkan nama pemilik"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Tanggal Kebiri</label>
            <input
              type="date"
              name="tanggalKebiri"
              value={formData.tanggalKebiri}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Diterima">Diterima</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <button
            onClick={handleAddSale}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Simpan
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Hewan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pemilik
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Kebiri
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.namaHewan}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.jenis}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.pemilik}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {sale.tanggalKebiri}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                      sale.status === "Diterima"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    onClick={() => alert("Fitur Edit belum tersedia")}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 font-semibold"
                    onClick={() => handleDelete(sale.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data reservasi kebiri
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
