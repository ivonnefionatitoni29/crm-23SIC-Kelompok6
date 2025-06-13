import React, { useState, useEffect } from 'react'

const FormKebiri = () => {
  const [form, setForm] = useState({
    namaHewan: '',
    jenis: '',
    tanggalKebiri: '',
  })

  const [dataUser, setDataUser] = useState([])

  const username = localStorage.getItem('username') || 'user'

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem('dataKebiri')) || []
    const filtered = allData.filter((item) => item.pemilik === username)
    setDataUser(filtered)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newData = {
      ...form,
      id: Date.now(),
      pemilik: username,
      status: 'Pending',
    }

    const allData = JSON.parse(localStorage.getItem('dataKebiri')) || []
    const updatedData = [...allData, newData]

    localStorage.setItem('dataKebiri', JSON.stringify(updatedData))
    setForm({ namaHewan: '', jenis: '', tanggalKebiri: '' })

    const filtered = updatedData.filter((item) => item.pemilik === username)
    setDataUser(filtered)
  }

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 text-xl font-semibold">
          Form Kebiri Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="namaHewan"
            placeholder="Nama Hewan"
            className="w-full p-2 border rounded"
            value={form.namaHewan}
            onChange={handleChange}
          />
          <input
            name="jenis"
            placeholder="Jenis Hewan"
            className="w-full p-2 border rounded"
            value={form.jenis}
            onChange={handleChange}
          />
          <input
            name="tanggalKebiri"
            type="date"
            className="w-full p-2 border rounded"
            value={form.tanggalKebiri}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Kirim
          </button>
        </form>
      </div>

      {/* TABEL DATA */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-green-700">Data Reservasi Saya</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-green-200 text-green-800">
              <tr>
                <th className="py-2 px-4 text-left">Nama Hewan</th>
                <th className="py-2 px-4 text-left">Jenis</th>
                <th className="py-2 px-4 text-left">Tanggal</th>
                <th className="py-2 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataUser.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">Belum ada reservasi.</td>
                </tr>
              ) : (
                dataUser.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 px-4">{item.namaHewan}</td>
                    <td className="py-2 px-4">{item.jenis}</td>
                    <td className="py-2 px-4">{item.tanggalKebiri}</td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Diterima'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Ditolak'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FormKebiri
