import React, { useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

function PrediksiKesehatan() {
  const [form, setForm] = useState({
    suhu: "",
    nafsuMakan: "",
    berat: "",
    usia: "",
    muntah: ""
  });

  const [hasil, setHasil] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/predict`,
        {
          Suhu: parseFloat(form.suhu),
          Nafsu_Makan: parseInt(form.nafsuMakan),
          Berat: parseFloat(form.berat),
          Usia: parseInt(form.usia),
          Muntah: parseInt(form.muntah)
        }
      );

      const hasilPrediksi = res.data.hasil_prediksi === 0 ? "Sehat 🐾" : "Sakit 💉";
      setHasil(`Hewan kamu kemungkinan: ${hasilPrediksi}`);
    } catch (error) {
      console.error(error);
      setHasil("⚠️ Terjadi kesalahan saat memproses prediksi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">🩺 Prediksi Kesehatan Hewan</h2>
        <p className="text-center text-gray-600 mb-6">
          Masukkan data hewan peliharaan kamu untuk mengetahui kondisi kesehatannya.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Suhu (°C)", name: "suhu" },
            { label: "Nafsu Makan (1 = tidak, 2 = biasa, 3 = lahap)", name: "nafsuMakan" },
            { label: "Berat (kg)", name: "berat" },
            { label: "Usia (tahun)", name: "usia" },
            { label: "Muntah (0 = tidak, 1 = ya)", name: "muntah" }
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            🔍 Prediksi Sekarang
          </button>
        </form>

        {hasil && (
          <>
            <p
              className={`mt-6 text-center text-xl font-semibold ${
                hasil.includes("Sakit") ? "text-red-600" : "text-blue-800"
              }`}
            >
              {hasil}
            </p>

            <div
              className={`mt-6 border rounded-lg p-4 ${
                hasil.includes("Sakit") ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <h3
                className={`text-md font-bold text-center mb-2 ${
                  hasil.includes("Sakit") ? "text-red-600" : "text-blue-600"
                }`}
              >
                📊 Data yang Dimasukkan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Suhu", value: parseFloat(form.suhu) },
                    { name: "Nafsu Makan", value: parseInt(form.nafsuMakan) },
                    { name: "Berat", value: parseFloat(form.berat) },
                    { name: "Usia", value: parseInt(form.usia) },
                    { name: "Muntah", value: parseInt(form.muntah) },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill={hasil.includes("Sakit") ? "#f56565" : "#3b82f6"} // merah atau biru
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PrediksiKesehatan;
