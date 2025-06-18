import React, { useState, useEffect } from 'react';

const VaccinationManagement = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dataVaksinasi')) || [];
    setData(stored);
  }, []);

  const ubahStatus = (id) => {
    const updated = data.map((item) =>
      item.id === id
        ? {
            ...item,
            status:
              item.status === 'Pending'
                ? 'Diterima'
                : item.status === 'Diterima'
                ? 'Ditolak'
                : 'Pending',
          }
        : item
    );
    setData(updated);
    localStorage.setItem('dataVaksinasi', JSON.stringify(updated));
  };

  const hapusData = (id) => {
    const konfirmasi = confirm('Yakin ingin menghapus data ini?');
    if (!konfirmasi) return;

    const updated = data.filter((item) => item.id !== id);
    setData(updated);
    localStorage.setItem('dataVaksinasi', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Manajemen Vaksinasi Hewan
        </h2>
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-blue-800">Nama Hewan</th>
              <th className="px-4 py-2 text-left text-blue-800">Jenis Hewan</th>
              <th className="px-4 py-2 text-left text-blue-800">Jenis Vaksin</th>
              <th className="px-4 py-2 text-left text-blue-800">Jam Vaksin</th>
              <th className="px-4 py-2 text-left text-blue-800">Tanggal</th>
              <th className="px-4 py-2 text-center text-blue-800">Status</th>
              <th className="px-4 py-2 text-center text-blue-800">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 bg-white">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.vaksin}</td>
                <td className="px-4 py-2">{item.jam}</td>
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Diterima'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'Ditolak'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => ubahStatus(item.id)}
                    className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Ubah Status
                  </button>
                  <button
                    onClick={() => hapusData(item.id)}
                    className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-blue-500">
                  Tidak ada data vaksinasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccinationManagement;
