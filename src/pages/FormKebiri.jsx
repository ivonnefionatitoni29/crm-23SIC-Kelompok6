import React, { useState, useEffect } from 'react'

const FormKebiri = () => {
  const [form, setForm] = useState({
    namaPemilik: '',
    jenis: '',
    tanggalKebiri: '',
    jamKebiri: '',
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
      id: Date.now(),
      nama: form.namaPemilik,
      jenis: form.jenis,
      tanggal: form.tanggalKebiri,
      jam: form.jamKebiri,
      pemilik: username,
      status: 'Pending',
    }

    const allData = JSON.parse(localStorage.getItem('dataKebiri')) || []
    const updatedData = [...allData, newData]

    localStorage.setItem('dataKebiri', JSON.stringify(updatedData))
    setForm({ namaPemilik: '', jenis: '', tanggalKebiri: '', jamKebiri: '' })

    const filtered = updatedData.filter((item) => item.pemilik === username)
    setDataUser(filtered)
  }

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-xl font-semibold">
          Form Kebiri Hewan
        </div>
        <div className="px-6 pt-4 pb-2 text-gray-700 text-sm">
          Silakan isi form kebiri hewan dengan lengkap. Setelah dikirim, reservasi Anda akan diproses oleh admin.
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama Pemilik</label>
            <input
              name="namaPemilik"
              placeholder="Nama Pemilik"
              className="w-full p-2 border rounded"
              value={form.namaPemilik}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Jenis Hewan</label>
            <input
              name="jenis"
              placeholder="Jenis Hewan"
              className="w-full p-2 border rounded"
              value={form.jenis}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Kebiri</label>
            <input
              name="tanggalKebiri"
              type="date"
              className="w-full p-2 border rounded"
              value={form.tanggalKebiri}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Jam Kebiri</label>
            <input
              name="jamKebiri"
              type="time"
              className="w-full p-2 border rounded"
              value={form.jamKebiri}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Kirim
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Data Reservasi Saya</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-200 text-blue-800">
              <tr>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Jenis</th>
                <th className="py-2 px-4 text-left">Tanggal</th>
                <th className="py-2 px-4 text-left">Jam</th>
                <th className="py-2 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataUser.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Belum ada reservasi.
                  </td>
                </tr>
              ) : (
                dataUser.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 px-4">{item.nama}</td>
                    <td className="py-2 px-4">{item.jenis}</td>
                    <td className="py-2 px-4">{item.tanggal}</td>
                    <td className="py-2 px-4">{item.jam}</td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Diterima'
                            ? 'bg-blue-100 text-blue-800'
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
