// src/pages/FormPenitipan.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import UserHeader from "../components/UserHeader";
import { useNavigate } from "react-router-dom";

const FormPenitipan = () => {
  const [form, setForm] = useState({
    nama: "",
    usia: "",
    kelamin: "",
    jenis: "",
    ras: "",
    pemilik: "",
    checkIn: "",
    checkOut: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const navigate = useNavigate();

  // --- State untuk UserHeader ---
  const [username, setUsername] = useState("User");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);

  const handleReservasiClick = () => {
    setShowReservasiMenu(!showReservasiMenu);
  };

  const formatPoints = (points) => {
    return points.toLocaleString("id-ID");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReservasiMenu && !event.target.closest(".relative")) {
        setShowReservasiMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReservasiMenu]);

  // --- Form Logic ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);

    const newData = {
      nama_hewan: form.nama,
      usia: parseInt(form.usia, 10),
      kelamin: form.kelamin,
      jenis_hewan: form.jenis,
      ras: form.ras,
      pemilik: form.pemilik,
      check_in: form.checkIn,
      check_out: form.checkOut,
      status: "Pending",
    };

    const { error } = await supabase.from("penitipan").insert([newData]);

    if (error) {
      console.error("Error inserting data:", error);
      setSubmitMessage({ type: "error", text: "Terjadi kesalahan saat mengirim reservasi: " + error.message });
    } else {
      setSubmitMessage({ type: "success", text: "Reservasi berhasil dikirim!" });
      setForm({
        nama: "",
        usia: "",
        kelamin: "",
        jenis: "",
        ras: "",
        pemilik: "",
        checkIn: "",
        checkOut: "",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <UserHeader
        username={username}
        loyaltyPoints={loyaltyPoints}
        cartItemCount={cartItemCount}
        showReservasiMenu={showReservasiMenu}
        handleReservasiClick={handleReservasiClick}
        formatPoints={formatPoints}
        handleLogout={handleLogout}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold">
            Form Penitipan Hewan
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {submitMessage && (
              <div
                className={`px-4 py-3 rounded-md mb-4 ${
                  submitMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div>
              <label htmlFor="nama" className="block mb-1 text-gray-700 font-semibold">Nama Hewan</label>
              <input
                id="nama"
                name="nama"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Miko"
                required
              />
            </div>

            <div>
              <label htmlFor="usia" className="block mb-1 text-gray-700 font-semibold">Usia (bulan)</label>
              <input
                id="usia"
                name="usia"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.usia}
                onChange={handleChange}
                placeholder="Contoh: 12"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="kelamin" className="block mb-1 text-gray-700 font-semibold">Jenis Kelamin</label>
              <select
                id="kelamin"
                name="kelamin"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.kelamin}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Pilih Jenis Kelamin</option>
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>

            <div>
              <label htmlFor="jenis" className="block mb-1 text-gray-700 font-semibold">Jenis Hewan</label>
              <input
                id="jenis"
                name="jenis"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.jenis}
                onChange={handleChange}
                placeholder="Contoh: Kucing, Anjing"
                required
              />
            </div>

            <div>
              <label htmlFor="ras" className="block mb-1 text-gray-700 font-semibold">Ras Hewan</label>
              <input
                id="ras"
                name="ras"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.ras}
                onChange={handleChange}
                placeholder="Contoh: Persia, Golden Retriever"
                required
              />
            </div>

            <div>
              <label htmlFor="pemilik" className="block mb-1 text-gray-700 font-semibold">Nama Pemilik</label>
              <input
                id="pemilik"
                name="pemilik"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={form.pemilik}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="checkIn" className="block mb-1 text-gray-700 font-semibold">Tanggal Check-in</label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={form.checkIn}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="checkOut" className="block mb-1 text-gray-700 font-semibold">Tanggal Check-out</label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={form.checkOut}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Reservasi"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormPenitipan;
