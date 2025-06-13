import React, { useState, useEffect } from 'react'

const FormPenitipan = () => {
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    ras: '',
    pemilik: '',
    checkIn: '',
    checkOut: '',
  })

  const [data, setData] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('dataPenitipan')) || []
    setData(stored)
  }, [])

  // update otomatis jika ada perubahan localStorage dari tab lain
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dataPenitipan') {
        const updated = JSON.parse(e.newValue) || []
        setData(updated)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newData = {
      id: Date.now(),
      ...form,
      status: 'Pending',
    }
    const updated = [...data, newData]
    localStorage.setItem('dataPenitipan', JSON.stringify(updated))
    setData(updated)
    setForm({
      nama: '',
      jenis: '',
      ras: '',
      pemilik: '',
      checkIn: '',
      checkOut: '',
    })
  }

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 text-xl font-semibold">
          Form Penitipan Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="nama" placeholder="Nama Hewan" className="w-full p-2 border rounded" value={form.nama} onChange={handleChange} />
          <input name="jenis" placeholder="Jenis Hewan" className="w-full p-2 border rounded" value={form.jenis} onChange={handleChange} />
          <input name="ras" placeholder="Ras Hewan" className="w-full p-2 border rounded" value={form.ras} onChange={handleChange} />
          <input name="pemilik" placeholder="Nama Pemilik" className="w-full p-2 border rounded" value={form.pemilik} onChange={handleChange} />
          <div className="flex gap-4">
            <input name="checkIn" type="date" className="w-full p-2 border rounded" value={form.checkIn} onChange={handleChange} />
            <input name="checkOut" type="date" className="w-full p-2 border rounded" value={form.checkOut} onChange={handleChange} />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Kirim</button>
        </form>
      </div>

      {/* TABEL DATA */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-green-700">Data Reservasi Saya</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-green-200 text-green-800">
              <tr>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Jenis</th>
                <th className="py-2 px-4 text-left">Ras</th>
                <th className="py-2 px-4 text-left">Pemilik</th>
                <th className="py-2 px-4 text-left">Check-in</th>
                <th className="py-2 px-4 text-left">Check-out</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">Belum ada reservasi.</td>
                </tr>
              )}
              {data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{item.nama}</td>
                  <td className="py-2 px-4">{item.jenis}</td>
                  <td className="py-2 px-4">{item.ras}</td>
                  <td className="py-2 px-4">{item.pemilik}</td>
                  <td className="py-2 px-4">{item.checkIn}</td>
                  <td className="py-2 px-4">{item.checkOut}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Diterima' ? 'bg-green-100 text-green-700'
                      : item.status === 'Ditolak' ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FormPenitipan
