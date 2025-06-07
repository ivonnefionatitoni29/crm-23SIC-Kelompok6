import React, { useState } from 'react'

const FormPenitipan = () => {
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    ras: '',
    pemilik: '',
    checkIn: '',
    checkOut: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Data Penitipan:', form)
  }

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-start py-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 text-xl font-semibold">
          Form Penitipan Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="nama" placeholder="Nama Hewan" className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="jenis" placeholder="Jenis Hewan" className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="ras" placeholder="Ras Hewan" className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="pemilik" placeholder="Nama Pemilik" className="w-full p-2 border rounded" onChange={handleChange} />
          <div className="flex gap-4">
            <input name="checkIn" type="date" className="w-full p-2 border rounded" onChange={handleChange} />
            <input name="checkOut" type="date" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Kirim
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormPenitipan
