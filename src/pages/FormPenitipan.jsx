import React, { useState, useEffect } from "react";

const FormPenitipan = () => {
  const [form, setForm] = useState({
    nama: "",
    jenis: "",
    ras: "",
    pemilik: "",
    checkIn: "",
    checkOut: "",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dataPenitipan")) || [];
    setData(stored);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "dataPenitipan") {
        const updated = JSON.parse(e.newValue) || [];
        setData(updated);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      id: Date.now(),
      ...form,
      status: "Pending",
    };
    const updated = [...data, newData];
    localStorage.setItem("dataPenitipan", JSON.stringify(updated));
    setData(updated);
    setForm({
      nama: "",
      jenis: "",
      ras: "",
      pemilik: "",
      checkIn: "",
      checkOut: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold">
          Form Penitipan Hewan
        </div>
        <div className="px-6 pt-3 pb-2 text-gray-600 text-sm italic">
          Silakan isi form dengan lengkap. Reservasi Anda akan diproses oleh admin dan statusnya ditampilkan di bawah.
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {[
            { label: "Nama Hewan", name: "nama" },
            { label: "Jenis Hewan", name: "jenis" },
            { label: "Ras Hewan", name: "ras" },
            { label: "Nama Pemilik", name: "pemilik" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                {field.label}
              </label>
              <input
                name={field.name}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Tanggal Check-in
              </label>
              <input
                name="checkIn"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Tanggal Check-out
              </label>
              <input
                name="checkOut"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={form.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg"
          >
            Kirim Reservasi
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Data Reservasi Saya
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-100 text-blue-800 uppercase text-xs tracking-wider">
              <tr>
                {[
                  "Nama",
                  "Jenis",
                  "Ras",
                  "Pemilik",
                  "Check-in",
                  "Check-out",
                  "Status",
                ].map((head) => (
                  <th key={head} className="py-2 px-4">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Belum ada reservasi.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="py-2 px-4">{item.nama}</td>
                    <td className="py-2 px-4">{item.jenis}</td>
                    <td className="py-2 px-4">{item.ras}</td>
                    <td className="py-2 px-4">{item.pemilik}</td>
                    <td className="py-2 px-4">{item.checkIn}</td>
                    <td className="py-2 px-4">{item.checkOut}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow ${
                          item.status === "Diterima"
                            ? "bg-blue-100 text-blue-700"
                            : item.status === "Ditolak"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
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
  );
};

export default FormPenitipan;
