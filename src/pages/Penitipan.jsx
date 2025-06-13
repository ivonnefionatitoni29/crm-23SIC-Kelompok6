import React, { useEffect, useState } from "react";

export default function PetBoardingManagement() {
  const [dataPenitipan, setDataPenitipan] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dataPenitipan")) || [];
    setDataPenitipan(stored);
  }, []);

  const handleStatusChange = (id) => {
    const updated = dataPenitipan.map((item) =>
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
    setDataPenitipan(updated);
    localStorage.setItem("dataPenitipan", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const confirmed = confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;

    const updated = dataPenitipan.filter((item) => item.id !== id);
    setDataPenitipan(updated);
    localStorage.setItem("dataPenitipan", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Manajemen Penitipan Hewan
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Jenis</th>
              <th className="px-4 py-2 text-left">Ras</th>
              <th className="px-4 py-2 text-left">Pemilik</th>
              <th className="px-4 py-2 text-left">Check-in</th>
              <th className="px-4 py-2 text-left">Check-out</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataPenitipan.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.ras}</td>
                <td className="px-4 py-2">{item.pemilik}</td>
                <td className="px-4 py-2">{item.checkIn}</td>
                <td className="px-4 py-2">{item.checkOut}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Diterima"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Ditolak"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleStatusChange(item.id)}
                    className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                  >
                    Ubah Status
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {dataPenitipan.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Tidak ada data penitipan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
