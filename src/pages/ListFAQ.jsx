import React, { useState, useEffect } from "react";
// Assuming supabase client is configured and exported from this path
// Adjusted path for common project structures. If this still causes an error,
// please verify the exact path to your supabase.js file relative to this component.
import { supabase } from "../supabase"; // Adjusted path from "./supabase" to "../supabase"
// ^^^ Pastikan jalur ini benar menuju inisialisasi Supabase client Anda.

const ListFAQ = () => {
  // State untuk menyimpan daftar FAQ
  const [faqs, setFaqs] = useState([]);
  // State untuk menunjukkan status loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi
  const [error, setError] = useState(null);
  // State untuk mengontrol tampilan form tambah/edit FAQ
  const [showForm, setShowForm] = useState(false);
  // State untuk data form (pertanyaan dan jawaban)
  const [formData, setFormData] = useState({ question: "", answer: "" });
  // State untuk menyimpan ID FAQ yang sedang diedit (null jika mode tambah)
  const [editId, setEditId] = useState(null);
  // State untuk mengontrol tampilan modal konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // State untuk menentukan aksi modal (delete atau cancel)
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'cancel'
  // State untuk menyimpan ID item yang akan dihapus
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  // Fungsi untuk mengambil data FAQ dari Supabase
  const fetchFaqs = async () => {
    setLoading(true); // Set loading ke true saat memulai fetch
    setError(null); // Bersihkan error sebelumnya
    const { data, error } = await supabase
      .from('faqs') // Pilih tabel 'faqs'
      .select('*') // Ambil semua kolom
      .order('created_at', { ascending: false }); // Urutkan berdasarkan tanggal dibuat terbaru

    if (error) {
      console.error('Error fetching FAQs:', error.message);
      setError('Gagal memuat FAQ. Silakan coba lagi.'); // Set pesan error
    } else {
      setFaqs(data); // Update state faqs dengan data yang diterima
    }
    setLoading(false); // Set loading ke false setelah fetch selesai
  };

  // Effect hook untuk memuat FAQ saat komponen pertama kali di-mount
  // dan juga untuk berlangganan pembaruan real-time dari Supabase.
  useEffect(() => {
    fetchFaqs(); // Panggil fungsi fetchFaqs saat komponen di-mount

    // Berlangganan perubahan real-time pada tabel 'faqs'.
    // Ini adalah bagian kunci yang membuat data update otomatis tanpa refresh.
    const channel = supabase
      .channel('public:faqs') // Nama channel (bisa apa saja, tapi 'public:nama_tabel' umum)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, payload => {
        // 'event: *' berarti melacak semua event (INSERT, UPDATE, DELETE)
        // 'schema: public' dan 'table: faqs' menentukan tabel yang dilacak
        console.log('Perubahan Realtime diterima untuk FAQs:', payload);
        // Ketika ada perubahan, panggil kembali fetchFaqs untuk memperbarui UI.
        fetchFaqs();
      })
      .subscribe(); // Jangan lupa memanggil .subscribe() untuk mengaktifkan langganan

    // Fungsi cleanup: Ini akan dijalankan saat komponen di-unmount (dihapus dari DOM).
    // Penting untuk membersihkan langganan agar tidak terjadi kebocoran memori.
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Array dependensi kosong berarti effect ini hanya berjalan sekali saat mount dan cleanup saat unmount.

  // Handle perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle penambahan atau pembaruan FAQ
  const handleAddOrUpdateFAQ = async () => {
    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setError("Pertanyaan dan jawaban tidak boleh kosong."); // Tampilkan error jika ada input kosong
      return;
    }

    setLoading(true);
    setError(null);

    if (editId !== null) {
      // Jika editId tidak null, berarti mode edit: update FAQ yang ada
      const { data, error } = await supabase
        .from('faqs')
        .update({ question: trimmedQuestion, answer: trimmedAnswer })
        .eq('id', editId) // Perbarui FAQ dengan ID yang cocok
        .select(); // Ambil data yang diperbarui

      if (error) {
        console.error('Error memperbarui FAQ:', error.message);
        setError('Gagal memperbarui FAQ. Silakan coba lagi.');
      } else {
        console.log('FAQ diperbarui:', data);
        // Tidak perlu memanggil fetchFaqs() di sini karena Realtime akan menangani pembaruan UI.
      }
    } else {
      // Jika editId null, berarti mode tambah: masukkan FAQ baru
      const { data, error } = await supabase
        .from('faqs')
        .insert([{ question: trimmedQuestion, answer: trimmedAnswer }])
        .select(); // Ambil data yang baru ditambahkan

      if (error) {
        console.error('Error menambahkan FAQ:', error.message);
        setError('Gagal menambahkan FAQ. Silakan coba lagi.');
      } else {
        console.log('FAQ ditambahkan:', data);
        // Tidak perlu memanggil fetchFaqs() di sini karena Realtime akan menangani pembaruan UI.
      }
    }

    // Reset form, sembunyikan form, dan bersihkan editId setelah operasi selesai
    setFormData({ question: "", answer: "" });
    setShowForm(false);
    setEditId(null);
    setLoading(false);
  };

  // Siapkan untuk aksi hapus dengan menampilkan modal konfirmasi
  const handleDeleteConfirm = (id) => {
    setItemIdToDelete(id);
    setModalAction('delete');
    setShowConfirmModal(true);
  };

  // Eksekusi aksi hapus
  const handleDelete = async () => {
    if (itemIdToDelete === null) return; // Pastikan ada ID yang akan dihapus

    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', itemIdToDelete); // Hapus FAQ dengan ID yang cocok

    if (error) {
      console.error('Error menghapus FAQ:', error.message);
      setError('Gagal menghapus FAQ. Silakan coba lagi.');
    } else {
      console.log('FAQ dihapus:', itemIdToDelete);
      // Tidak perlu memanggil fetchFaqs() di sini karena Realtime akan menangani pembaruan UI.
    }
    setLoading(false);
    // Tutup modal dan reset state terkait setelah hapus
    setShowConfirmModal(false);
    setItemIdToDelete(null);
    setModalAction(null);
    // Jika FAQ yang dihapus adalah yang sedang diedit, reset form dan editId
    if (editId === itemIdToDelete) {
      setEditId(null);
      setShowForm(false);
      setFormData({ question: "", answer: "" });
    }
  };

  // Handle pengeditan FAQ: mengisi form dengan data FAQ yang dipilih
  const handleEdit = (faq) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditId(faq.id); // Set ID FAQ yang akan diedit
    setShowForm(true); // Tampilkan form
    setError(null); // Bersihkan error sebelumnya
  };

  // Handle pembatalan form atau modal
  const handleCancel = () => {
    setShowConfirmModal(false); // Sembunyikan modal konfirmasi
    setModalAction(null); // Reset aksi modal
    setItemIdToDelete(null); // Reset ID item yang akan dihapus
    setEditId(null); // Reset ID edit
    setShowForm(false); // Sembunyikan form
    setFormData({ question: "", answer: "" }); // Reset data form
    setError(null); // Bersihkan error
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen FAQ
        </h1>

        {/* Area pesan error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Area pesan loading */}
        {loading && (
          <p className="text-center text-lg text-blue-600 mb-4">Memuat data...</p>
        )}

        {/* Tombol Tambah FAQ Baru (hanya tampil jika form tidak aktif) */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Tambah FAQ Baru
          </button>
        )}

        {/* Form Tambah/Edit FAQ (tampil jika showForm true) */}
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
                Jawaban
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Masukkan jawaban FAQ"
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

        {/* Tampilan daftar FAQ */}
        {!loading && !error && faqs.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg relative mb-4 text-center">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada FAQ yang tersedia.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-blue-200 text-sm text-left text-gray-800">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl text-blue-800 font-semibold">Pertanyaan</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Jawaban</th>
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
              Apakah Anda yakin ingin {modalAction === 'delete' ? "menghapus FAQ ini" : "membatalkan"}?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={modalAction === 'delete' ? handleDelete : handleCancel}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  modalAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Ya
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
};

export default ListFAQ;