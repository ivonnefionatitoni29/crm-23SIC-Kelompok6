import React, { useState } from 'react'

const FormVaksinasi = () => {
  const [form, setForm] = useState({
    namaHewan: '',
    namaVaksin: '',
    tanggal: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Data Vaksinasi:', form)
  }

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-start py-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4 text-xl font-semibold">
          Form Vaksinasi Hewan
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="namaHewan" placeholder="Nama Hewan" className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="namaVaksin" placeholder="Nama Vaksin" className="w-full p-2 border rounded" onChange={handleChange} />
          <input name="tanggal" type="date" className="w-full p-2 border rounded" onChange={handleChange} />

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Kirim
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormVaksinasi
