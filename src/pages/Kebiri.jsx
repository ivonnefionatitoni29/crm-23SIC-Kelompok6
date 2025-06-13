import React, { useState, useEffect } from "react";

export default function AdminKebiri() {
  const [dataKebiri, setDataKebiri] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dataKebiri")) || [];
    setDataKebiri(stored);
  }, []);

  const handleStatusChange = (id) => {
    const updated = dataKebiri.map((item) =>
      item.id === id
        ? {
            ...item,
            status:
              item.status === "Pending"
                ? "Diterima"
                : item.status === "Diterima"
                ? "Ditolak"
                : "Pending",
          }
        : item
    );
    setDataKebiri(updated);
    localStorage.setItem("dataKebiri", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const updated = dataKebiri.filter((item) => item.id !== id);
    setDataKebiri(updated);
    localStorage.setItem("dataKebiri", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Manajemen Data Kebiri
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Jenis Hewan</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Jam</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataKebiri.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Tidak ada data reservasi.
                </td>
              </tr>
            ) : (
              dataKebiri.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{data.nama}</td>
                  <td className="px-4 py-2">{data.jenis}</td>
                  <td className="px-4 py-2">{data.tanggal}</td>
                  <td className="px-4 py-2">{data.jam}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        data.status === "Diterima"
                          ? "bg-green-100 text-green-700"
                          : data.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(data.id)}
                      className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                    >
                      Ubah Status
                    </button>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
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
