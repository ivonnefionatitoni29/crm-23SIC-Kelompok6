import React, { useState, useEffect } from "react";
// **********************************************************************************
// SANGAT PENTING: SILA SESUAIKAN JALUR IMPORT SUPABASE INI MENGIKUT STRUKTUR FOLDER PROJEK ANDA.
// Ralat "Could not resolve" ini berterusan dan merupakan PUNCA UTAMA masalah.
// Fail 'supabase.js' anda TIDAK DITEMUI pada jalur relatif yang telah dicuba setakat ini.
//
// UNTUK MENYELESAIKAN INI SECARA MUKTAMAD, ANDA PERLU MEMBERITAHU LOKASI TEPAT FAIL 'supabase.js' ANDA.
// Sila GANTI BARIS 'import { supabase } = ...' DI BAWAH INI DENGAN JALUR YANG BETUL
// SETELAH ANDA MENGESAHKANNYA SENDIRI DARI STRUKTUR PROJEK ANDA.
//
// Anda boleh melihat jalur penuh fail `FAQ.jsx` anda adalah:
// D:/project062025/crm-23SIC-Kelompok6/src/pages/FAQ.jsx
//
// Berikut adalah BEBERAPA CONTOH JALUR yang mungkin UNTUK FAIL `supabase.js` anda,
// bergantung pada di mana ia disimpan RELATIF KEPADA `src/pages/FAQ.jsx`:
//
// CONTOH 1: Jika 'supabase.js' berada di: D:/project062025/crm-23SIC-Kelompok6/src/supabase.js
//           (iaitu, di dalam folder 'src', setingkat dengan folder 'pages')
//           Maka, import yang BETUL adalah:
//           import { supabase } from "../supabase"; // Ini adalah cubaan lalai saya yang terakhir.
//
// CONTOH 2: Jika 'supabase.js' berada di: D:/project062025/crm-23SIC-Kelompok6/supabase.js
//           (iaitu, di akar projek anda, satu folder di atas folder 'src')
//           Maka, import yang BETUL adalah:
//           import { supabase } from "../../supabase";
//
// CONTOH 3: Jika 'supabase.js' berada di: D:/project062025/crm-23SIC-Kelompok6/src/utils/supabase.js
//           (iaitu, di dalam folder 'utils' yang berada di dalam folder 'src')
//           Maka, import yang BETUL adalah:
//           import { supabase } from "../utils/supabase";
//
// CONTOH 4: Jika 'supabase.js' berada di: D:/project062025/crm-23SIC-Kelompok6/src/config/supabase.js
//           (iaitu, di dalam folder 'config' yang berada di dalam folder 'src')
//           Maka, import yang BETUL adalah:
//           import { supabase } from "../config/supabase";
//
// SILA GANTI BARIS DI BAWAH INI DENGAN JALUR YANG BETUL UNTUK PROJEK ANDA!
import { supabase } from "../supabase"; // <<<<<<<<<<<<<<<<<<<<<<<<< JALUR INI MESTI DIBETULKAN SECARA MANUAL!


export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  // Fungsi untuk mengambil FAQ dari Supabase
  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan berdasarkan waktu pembuatan terbaru

    if (error) {
      console.error('Error fetching FAQs:', error.message);
      setError('Gagal memuat FAQ. Sila cuba lagi.');
    } else {
      setFaqs(data);
    }
    setLoading(false);
  };

  // Efek untuk memuat FAQ saat komponen dipasang dan berlangganan pembaruan real-time
  // Efek ini akan menangani pembaruan otomatis setelah import supabase diperbaiki.
  useEffect(() => {
    fetchFaqs();

    // Berlangganan perubahan real-time pada tabel 'faqs'
    // Setiap kali ada INSERT, UPDATE, atau DELETE di tabel 'faqs',
    // callback ini akan dipicu, dan 'fetchFaqs()' akan dipanggil ulang.
    const channel = supabase
      .channel('public:faqs_admin_changes') // Nama channel unik
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, payload => {
        console.log('Realtime change received for FAQs (Admin):', payload);
        fetchFaqs(); // Ambil ulang data setiap ada perubahan
      })
      .subscribe();

    // Fungsi cleanup saat komponen dilepas untuk menghindari kebocoran memori
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // [] memastikan efek ini hanya berjalan sekali saat mount

  // Mengelola perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mengelola penambahan atau pembaruan FAQ
  const handleAddOrUpdateFAQ = async () => {
    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setError("Pertanyaan dan jawapan harus diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    if (editId !== null) {
      // Perbarui FAQ yang sudah ada
      const { data, error } = await supabase
        .from('faqs')
        .update({ question: trimmedQuestion, answer: trimmedAnswer })
        .eq('id', editId)
        .select();

      if (error) {
        console.error('Error updating FAQ:', error.message);
        setError('Gagal memperbarui FAQ. Sila cuba lagi.');
      } else {
        console.log('FAQ diperbarui:', data);
        // Pembaruan UI akan ditangani oleh realtime listener, jadi tidak perlu panggil fetchFaqs di sini.
      }
    } else {
      // Tambah FAQ baru
      const { data, error } = await supabase
        .from('faqs')
        .insert([{ question: trimmedQuestion, answer: trimmedAnswer }])
        .select();

      if (error) {
        console.error('Error adding FAQ:', error.message);
        setError('Gagal menambah FAQ. Sila cuba lagi.');
      } else {
        console.log('FAQ ditambahkan:', data);
        // Pembaruan UI akan ditangani oleh realtime listener, jadi tidak perlu panggil fetchFaqs di sini.
      }
    }

    // Reset form dan sembunyikan form setelah operasi selesai
    setFormData({ question: "", answer: "" });
    setShowForm(false);
    setEditId(null);
    setLoading(false); // Selesai loading setelah operasi database
  };

  // Tampilkan modal konfirmasi sebelum menghapus
  const handleDeleteConfirm = (id) => {
    setItemIdToDelete(id);
    setShowConfirmModal(true);
  };

  // Jalankan aksi penghapusan setelah konfirmasi
  const handleDelete = async () => {
    if (itemIdToDelete === null) return;

    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', itemIdToDelete);

    if (error) {
      console.error('Error deleting FAQ:', error.message);
      setError('Gagal menghapus data: ' + error.message);
    } else {
      console.log('FAQ dihapus:', itemIdToDelete);
      // Pembaruan UI akan ditangani oleh real-time listener, jadi tidak perlu panggil fetchFaqs di sini.
    }
    setLoading(false);
    setShowConfirmModal(false); // Tutup modal
    setItemIdToDelete(null); // Reset ID untuk dihapus
    if (editId === itemIdToDelete) { // Jika FAQ yang diedit dihapus
      setEditId(null);
      setShowForm(false);
      setFormData({ question: "", answer: "" });
    }
  };

  // Mengelola pengeditan FAQ
  const handleEdit = (faq) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditId(faq.id);
    setShowForm(true);
    setError(null); // Hapus error sebelumnya
  };

  // Mengelola pembatalan form atau modal
  const handleCancel = () => {
    setShowConfirmModal(false);
    setItemIdToDelete(null);
    setEditId(null);
    setShowForm(false);
    setFormData({ question: "", answer: "" });
    setError(null); // Hapus error
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen FAQ
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {loading && (
          <p className="text-center text-lg text-blue-600 mb-4">Memuat data...</p>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Tambah FAQ Baru
          </button>
        )}

        {showForm && (
          <div className="mb-8 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {editId !== null ? "Edit FAQ" : "Tambah FAQ"}
            </h2>
            <div className="mb-4">
              <label htmlFor="question" className="block mb-2 font-medium text-blue-800">
                Pertanyaan
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Masukkan pertanyaan FAQ"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="answer" className="block mb-2 font-medium text-blue-800">
                Jawapan
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Masukkan jawapan FAQ"
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddOrUpdateFAQ}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {editId !== null ? "Simpan Perubahan" : "Simpan FAQ"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {!loading && !error && faqs.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg relative mb-4 text-center">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tiada FAQ yang tersedia.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-blue-200 text-sm text-left text-gray-800">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl text-blue-800 font-semibold">Pertanyaan</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Jawapan</th>
                  <th className="py-3 px-4 rounded-tr-xl text-center text-blue-800 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-3 px-4 font-medium">{faq.question}</td>
                    <td className="py-3 px-4 text-blue-700">{faq.answer}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(faq.id)}
                        className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Kustom */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi</h3>
            <p className="text-gray-700 mb-6">
              Adakah anda pasti ingin menghapus FAQ ini?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Ya, Hapus
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}