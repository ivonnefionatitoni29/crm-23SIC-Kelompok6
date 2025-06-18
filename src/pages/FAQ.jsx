import React, { useState, useEffect } from "react";

const getInitialFaqs = () => {
  const storedFaqs = localStorage.getItem("faqs");
  return storedFaqs
    ? JSON.parse(storedFaqs)
    : [
        {
          id: 1,
          question: "Bagaimana cara memesan produk?",
          answer:
            "Anda bisa memesan produk melalui halaman pemesanan di website kami.",
        },
        {
          id: 2,
          question: "Apakah produk bergaransi?",
          answer: "Ya, semua produk memiliki garansi resmi selama 1 tahun.",
        },
      ];
};

export default function FAQ() {
  const [faqs, setFaqs] = useState(getInitialFaqs);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("faqs", JSON.stringify(faqs));
  }, [faqs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFAQ = () => {
    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      alert("Pertanyaan dan jawaban harus diisi.");
      return;
    }

    if (editId !== null) {
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editId
          ? { ...faq, question: trimmedQuestion, answer: trimmedAnswer }
          : faq
      );
      setFaqs(updatedFaqs);
      setEditId(null);
    } else {
      const newFAQ = {
        id: faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 1,
        question: trimmedQuestion,
        answer: trimmedAnswer,
      };
      setFaqs([...faqs, newFAQ]);
    }

    setFormData({ question: "", answer: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus FAQ ini?")) {
      const updatedFaqs = faqs.filter((f) => f.id !== id);
      setFaqs(updatedFaqs);

      if (editId === id) {
        setEditId(null);
        setShowForm(false);
        setFormData({ question: "", answer: "" });
      }
    }
  };

  const handleEdit = (faq) => {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditId(faq.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setShowForm(false);
    setFormData({ question: "", answer: "" });
  };

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Manajemen FAQ</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Tambah FAQ
          </button>
        )}

        {showForm && (
          <div className="mb-6 p-4 border border-gray-300 rounded bg-white shadow-sm">
            <div className="mb-2">
              <label className="block mb-1 font-medium">Pertanyaan</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-indigo-400 focus:outline-none"
                placeholder="Masukkan pertanyaan"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Jawaban</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:ring-indigo-400 focus:outline-none"
                placeholder="Masukkan jawaban"
                rows={3}
              />
            </div>

            <div className="space-x-2">
              <button
                onClick={handleAddFAQ}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                {editId !== null ? "Simpan Perubahan" : "Simpan FAQ"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Pertanyaan</th>
              <th className="px-4 py-2 text-left">Jawaban</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faqs.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Belum ada FAQ.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{faq.question}</td>
                  <td className="px-4 py-2 text-gray-700">{faq.answer}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-3 py-1 rounded text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

