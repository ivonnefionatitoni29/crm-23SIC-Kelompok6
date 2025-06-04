import React, { useState } from "react";


const initialPets = [
  {
    id: 1,
    name: "Milo",
    type: "Anjing",
    breed: "Golden Retriever",
    owner: "Budi",
    checkin: "2025-06-01",
    checkout: "2025-06-05",
    notes: "Punya alergi makanan laut",
    active: true,
  },
  {
    id: 2,
    name: "Luna",
    type: "Kucing",
    breed: "Persia",
    owner: "Sari",
    checkin: "2025-06-02",
    checkout: "2025-06-04",
    notes: "",
    active: false,
  },
];

export default function PetBoardingManagement() {
  const [pets, setPets] = useState(initialPets);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    owner: "",
    checkin: "",
    checkout: "",
    notes: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddPet = () => {
    const requiredFields = ["name", "type", "breed", "owner", "checkin", "checkout"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert("Semua kolom wajib diisi!");
        return;
      }
    }
    const newPet = {
      ...formData,
      id: pets.length + 1,
    };
    setPets([...pets, newPet]);
    setFormData({
      name: "",
      type: "",
      breed: "",
      owner: "",
      checkin: "",
      checkout: "",
      notes: "",
      active: true,
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data hewan ini?")) {
      setPets(pets.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Manajemen Penitipan Hewan</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            {showForm ? "Batal" : "Tambah Hewan Titipan"}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "type", "breed", "owner", "checkin", "checkout"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium capitalize">{field}</label>
                  <input
                    type={field.includes("date") ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Catatan Khusus</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:outline-none"
                  rows="2"
                />
              </div>
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <label>Aktif (masih menginap)</label>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={handleAddPet}
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
                {["Nama", "Jenis", "Ras", "Pemilik", "Check-in", "Check-out", "Status", ""].map((h) => (
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
              {pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{pet.name}</td>
                  <td className="px-4 py-3">{pet.type}</td>
                  <td className="px-4 py-3">{pet.breed}</td>
                  <td className="px-4 py-3">{pet.owner}</td>
                  <td className="px-4 py-3">{pet.checkin}</td>
                  <td className="px-4 py-3">{pet.checkout}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pet.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {pet.active ? "Aktif" : "Selesai"}
                    </span>
                  </td>
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
              {pets.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Tidak ada data penitipan.
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