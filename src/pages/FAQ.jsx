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
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [editId, setEditId] = useState(null);

  // Simpan ke localStorage setiap kali faqs berubah
  useEffect(() => {
    localStorage.setItem("faqs", JSON.stringify(faqs));
  }, [faqs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFAQ = () => {
    if (!formData.question || !formData.answer) {
      alert("Pertanyaan dan jawaban harus diisi");
      return;
    }

    if (editId !== null) {
      // Edit mode
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editId
          ? { ...faq, question: formData.question, answer: formData.answer }
          : faq
      );
      setFaqs(updatedFaqs);
      setEditId(null);
    } else {
      // Tambah mode
      const newFAQ = {
        ...formData,
        id: faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 1,
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daftar FAQ</h1>

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
            />
          </div>

          <div className="space-x-2">
            <button
              onClick={handleAddFAQ}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editId !== null ? "Simpan Perubahan" : "Simpan FAQ"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded divide-y">
        {faqs.map((faq) => (
          <div key={faq.id} className="p-4">
            <h2 className="font-semibold text-lg">{faq.question}</h2>
            <p className="text-gray-700 mt-1">{faq.answer}</p>
            <div className="mt-2 text-sm text-right space-x-2">
              <button
                onClick={() => handleEdit(faq)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="text-red-600 hover:text-red-900"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-4 text-gray-500">Belum ada FAQ.</div>
        )}
      </div>
    </div>
  );
}
