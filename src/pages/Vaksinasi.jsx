import React, { useState } from "react";

const initialVaccinations = [
  {
    id: 1,
    petName: "Milo",
    vaccineName: "Rabies",
    date: "2025-05-01",
    notes: "Vaksin tahunan",
    status: "Sudah",
  },
  {
    id: 2,
    petName: "Luna",
    vaccineName: "Feline Distemper",
    date: "2025-05-10",
    notes: "",
    status: "Belum",
  },
];

export default function VaccinationManagement() {
  const [vaccinations, setVaccinations] = useState(initialVaccinations);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    vaccineName: "",
    date: "",
    notes: "",
    status: "Belum",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVaccination = () => {
    const requiredFields = ["petName", "vaccineName", "date"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("Semua kolom wajib diisi!");
        return;
      }
    }
    const newEntry = {
      ...formData,
      id: vaccinations.length + 1,
    };
    setVaccinations([...vaccinations, newEntry]);
    setFormData({
      petName: "",
      vaccineName: "",
      date: "",
      notes: "",
      status: "Belum",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data vaksinasi ini?")) {
      setVaccinations(vaccinations.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Manajemen Vaksinasi Hewan
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            {showForm ? "Batal" : "Tambah Vaksinasi"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Nama Hewan</label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Nama Vaksin</label>
                <input
                  type="text"
                  name="vaccineName"
                  value={formData.vaccineName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Tanggal Vaksinasi</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status Vaksinasi</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                  <option value="Terlambat">Terlambat</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Catatan</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                  rows="2"
                />
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={handleAddVaccination}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Nama Hewan", "Nama Vaksin", "Tanggal", "Status", "Catatan", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vaccinations.map((vaccine) => (
                <tr key={vaccine.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{vaccine.petName}</td>
                  <td className="px-4 py-3">{vaccine.vaccineName}</td>
                  <td className="px-4 py-3">{vaccine.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vaccine.status === "Sudah"
                          ? "bg-green-100 text-green-700"
                          : vaccine.status === "Terlambat"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {vaccine.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{vaccine.notes}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      className="text-indigo-500 hover:underline"
                      onClick={() => alert("Fitur edit belum tersedia")}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(pet.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {vaccinations.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Tidak ada data vaksinasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
