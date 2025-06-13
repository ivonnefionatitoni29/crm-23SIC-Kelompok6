import React, { useState, useEffect } from 'react'

const VaccinationManagement = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dataVaksinasi')) || []
    setData(stored)
  }, [])

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
    )
    setData(updated)
    localStorage.setItem('dataVaksinasi', JSON.stringify(updated))
  }

  const hapusData = (id) => {
    const konfirmasi = confirm('Yakin ingin menghapus data ini?')
    if (!konfirmasi) return

    const updated = data.filter((item) => item.id !== id)
    setData(updated)
    localStorage.setItem('dataVaksinasi', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Manajemen Vaksinasi Hewan
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nama Hewan</th>
              <th className="px-4 py-2 text-left">Jenis Hewan</th>
              <th className="px-4 py-2 text-left">Jenis Vaksin</th>
              <th className="px-4 py-2 text-left">Jam Vaksin</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.vaksin}</td>
                <td className="px-4 py-2">{item.jam}</td>
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Diterima'
                        ? 'bg-green-100 text-green-700'
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
                    className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                  >
                    Ubah Status
                  </button>
                  <button
                    onClick={() => hapusData(item.id)}
                    className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data vaksinasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VaccinationManagement
