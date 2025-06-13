import React, { useState } from "react";

export default function Kebiri() {
  const [reservasi, setReservasi] = useState([]);
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

  const handleAddReservasi = () => {
    const { namaHewan, jenis, pemilik, tanggalKebiri, status } = formData;
    if (!namaHewan || !jenis || !pemilik || !tanggalKebiri) {
      alert("Semua field wajib diisi!");
      return;
    }
    const newReservasi = {
      id: Date.now(),
      ...formData,
    };
    setReservasi([...reservasi, newReservasi]);
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
      setReservasi(reservasi.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Jadwal Reservasi Kebiri</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
      >
        {showForm ? "Batal Tambah Reservasi" : "Tambah Reservasi"}
      </button>

      {showForm && (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Hewan</label>
              <input
                type="text"
                name="namaHewan"
                value={formData.namaHewan}
                onChange={handleInputChange}
                placeholder="Contoh: Kucing"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jenis</label>
              <input
                type="text"
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                placeholder="Contoh: Persia"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pemilik</label>
              <input
                type="text"
                name="pemilik"
                value={formData.pemilik}
                onChange={handleInputChange}
                placeholder="Nama Pemilik"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Kebiri</label>
              <input
                type="date"
                name="tanggalKebiri"
                value={formData.tanggalKebiri}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddReservasi}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
          >
            Simpan Reservasi
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">No</th>
              <th className="px-6 py-3 text-left font-semibold">Nama Hewan</th>
              <th className="px-6 py-3 text-left font-semibold">Jenis</th>
              <th className="px-6 py-3 text-left font-semibold">Pemilik</th>
              <th className="px-6 py-3 text-left font-semibold">Tanggal Kebiri</th>
              <th className="px-6 py-3 text-center font-semibold">Status</th>
              <th className="px-6 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {reservasi.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Tidak ada data reservasi kebiri.
                </td>
              </tr>
            ) : (
              reservasi.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.namaHewan}</td>
                  <td className="px-6 py-4">{item.jenis}</td>
                  <td className="px-6 py-4">{item.pemilik}</td>
                  <td className="px-6 py-4">{item.tanggalKebiri}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Diterima"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => alert("Fitur edit belum tersedia.")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
