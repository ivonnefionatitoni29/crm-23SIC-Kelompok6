import React, { useEffect, useState } from "react";

export default function Kebiri() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dataKebiri")) || [];
    setSales(stored);
  }, []);

  const nextStatus = (current) => {
    if (current === "Pending") return "Diterima";
    if (current === "Diterima") return "Ditolak";
    return "Pending";
  };

  const handleToggleStatus = (id) => {
    const updated = sales.map((item) =>
      item.id === id ? { ...item, status: nextStatus(item.status) } : item
    );
    setSales(updated);
    localStorage.setItem("dataKebiri", JSON.stringify(updated));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manajemen Reservasi Kebiri</h2>
      <table className="w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nama Hewan</th>
            <th className="p-2 text-left">Jenis</th>
            <th className="p-2 text-left">Pemilik</th>
            <th className="p-2 text-left">Tanggal</th>
            <th className="p-2 text-center">Status & Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.namaHewan}</td>
              <td className="p-2">{item.jenis}</td>
              <td className="p-2">{item.pemilik}</td>
              <td className="p-2">{item.tanggalKebiri}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                    item.status === "Diterima"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : item.status === "Ditolak"
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  }`}
                >
                  {item.status}
                </button>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Tidak ada data reservasi
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
