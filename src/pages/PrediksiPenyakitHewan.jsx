import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function PrediksiKesehatan() {
  const [form, setForm] = useState({
    suhu: "",
    nafsuMakan: "",
    berat: "",
    usia: "",
    muntah: "",
    agresif: "",
    grooming: ""
  });

  const [hasil, setHasil] = useState("");
  const [confidence, setConfidence] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      suhu: parseFloat(form.suhu),
      berat: parseFloat(form.berat),
      usia: parseFloat(form.usia),
      nafsu_makan: form.nafsuMakan,
      muntah: form.muntah,
      agresif: form.agresif,
      grooming: form.grooming
    };

    try {
      const response = await fetch("https://0cb9-34-125-181-237.ngrok-free.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        const label = data.predicted_label;
        setHasil(`Hasil Prediksi Hewan Kamu: ${label === "tidak sehat" ? "Sakit 💉" : "Sehat 🐾"}`);
        setConfidence(data.confidence);
      } else {
        setHasil("⚠ Terjadi kesalahan: " + data.error);
        setConfidence(null);
      }
    } catch (error) {
      console.error(error);
      setHasil("⚠ Terjadi kesalahan saat menghubungi server.");
      setConfidence(null);
    }
  };

  const chartData = [
    { name: "Suhu", value: parseFloat(form.suhu) || 0 },
    { name: "Nafsu Makan", value: form.nafsuMakan === "tinggi" ? 1 : 0 },
    { name: "Berat", value: parseFloat(form.berat) || 0 },
    { name: "Usia", value: parseFloat(form.usia) || 0 },
    { name: "Muntah", value: form.muntah === "ya" ? 1 : 0 },
    { name: "Agresif", value: form.agresif === "ya" ? "ya" : "tidak" },
    { name: "Grooming", value: form.grooming === "sering" ? 2 : form.grooming === "kadang-kadang" ? 1 : 0 }

  ];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">Prediksi Kesehatan Hewan</h1>
        <p className="text-center text-gray-600 mb-6">Masukkan data hewan peliharaan kamu untuk mengetahui kondisi kesehatannya.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[ 
              { label: "Suhu (°C)", name: "suhu", type: "number" },
              { label: "Berat (kg)", name: "berat", type: "number" },
              { label: "Usia (tahun)", name: "usia", type: "number" }
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}

            <div>
              <label className="block font-medium text-gray-700 mb-1">Nafsu Makan</label>
              <select name="nafsuMakan" value={form.nafsuMakan} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Pilih</option>
                <option value="tinggi">Tinggi</option>
                <option value="rendah">Rendah</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Muntah</label>
              <select name="muntah" value={form.muntah} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Pilih</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Agresifitas</label>
              <select name="agresif" value={form.agresif} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Pilih</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Grooming</label>
              <select name="grooming" value={form.grooming} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg">
                <option value="">Pilih</option>
                <option value="sering">Sering</option>
                <option value="kadang-kadang">Kadang-kadang</option>
                <option value="jarang">Jarang</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200">
            🔍 Prediksi Sekarang
          </button>
        </form>

        {hasil && (
          <>
            <p className={`mt-6 text-center text-xl font-semibold ${hasil.includes("Sakit") ? "text-red-600" : "text-blue-800"}`}>
              {hasil}
            </p>

            <div className={`mt-6 border rounded-lg p-4 ${hasil.includes("Sakit") ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
              <h3 className={`text-md font-bold text-center mb-2 ${hasil.includes("Sakit") ? "text-red-600" : "text-blue-600"}`}>
                📊 Data yang Dimasukkan
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={hasil.includes("Sakit") ? "#f56565" : "#3b82f6"} />
                </BarChart>
              </ResponsiveContainer>

              {confidence && (
                <div className="mt-8">
                  <h3 className={`text-md font-bold text-center mb-4 ${hasil.includes("Sakit") ? "text-red-600" : "text-blue-600"}`}>
                    📈 Confidence Prediksi
                  </h3>

                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      layout="vertical"
                      data={Object.entries(confidence).map(([label, value]) => ({
                        name: label,
                        value: value
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                      <Bar dataKey="value" fill={hasil.includes("Sakit") ? "#f56565" : "#3b82f6"} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PrediksiKesehatan;
