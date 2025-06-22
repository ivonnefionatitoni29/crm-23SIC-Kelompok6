import React, { useState, useEffect } from "react";
// Assuming supabase client is configured and exported from this path
// Adjusted path for common project structures. If this still causes an error,
// please verify the exact path to your supabase.js file relative to this component.
import { supabase } from "../supabase"; // Adjusted path from "./supabase" to "../supabase"

const ListFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'cancel'
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  // Fetch FAQs from Supabase
  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false }); // Order by creation date

    if (error) {
      console.error('Error fetching FAQs:', error.message);
      setError('Failed to load FAQs. Please try again.');
    } else {
      setFaqs(data);
    }
    setLoading(false);
  };

  // Effect to fetch FAQs on component mount and subscribe to real-time updates
  useEffect(() => {
    fetchFaqs();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:faqs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, payload => {
        console.log('Realtime change received for FAQs:', payload);
        fetchFaqs(); // Re-fetch data on any change
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new FAQ or saving an edited FAQ
  const handleAddOrUpdateFAQ = async () => {
    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      // Using a simple message display instead of alert
      setError("Question and answer cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    if (editId !== null) {
      // Update existing FAQ
      const { data, error } = await supabase
        .from('faqs')
        .update({ question: trimmedQuestion, answer: trimmedAnswer })
        .eq('id', editId)
        .select();

      if (error) {
        console.error('Error updating FAQ:', error.message);
        setError('Failed to update FAQ. Please try again.');
      } else {
        console.log('FAQ updated:', data);
      }
    } else {
      // Add new FAQ
      const { data, error } = await supabase
        .from('faqs')
        .insert([{ question: trimmedQuestion, answer: trimmedAnswer }])
        .select();

      if (error) {
        console.error('Error adding FAQ:', error.message);
        setError('Failed to add FAQ. Please try again.');
      } else {
        console.log('FAQ added:', data);
      }
    }

    setFormData({ question: "", answer: "" });
    setShowForm(false);
    setEditId(null);
    setLoading(false);
  };

  // Prepare for delete action by showing confirmation modal
  const handleDeleteConfirm = (id) => {
    setItemIdToDelete(id);
    setModalAction('delete');
    setShowConfirmModal(true);
  };

  // Execute delete action
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
      setError('Failed to delete FAQ. Please try again.');
    } else {
      console.log('FAQ deleted:', itemIdToDelete);
      // Realtime subscription will handle UI update
    }
    setLoading(false);
    setShowConfirmModal(false);
    setItemIdToDelete(null);
    setModalAction(null);
    if (editId === itemIdToDelete) {
      setEditId(null);
      setShowForm(false);
      setFormData({ question: "", answer: "" });
    }
  };

  // Handle editing an FAQ
  const handleEdit = (faq) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditId(faq.id);
    setShowForm(true);
    setError(null); // Clear any previous errors
  };

  // Handle cancelling form or modal
  const handleCancel = () => {
    setShowConfirmModal(false);
    setModalAction(null);
    setItemIdToDelete(null);
    setEditId(null);
    setShowForm(false);
    setFormData({ question: "", answer: "" });
    setError(null); // Clear any errors
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

      {/* Custom Confirmation Modal */}
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