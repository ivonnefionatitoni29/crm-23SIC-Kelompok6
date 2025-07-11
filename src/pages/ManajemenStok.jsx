import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure this path is correct

export default function ManajemenStok() {
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    current_stock: "",
  });
  const [editId, setEditId] = useState(null); // ID of the stock item being edited
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For delete confirmation
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // ID of the item to delete

  // User and Role check (remains the same for access control)
  // useEffect(() => {
  //   const checkUserAndRole = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     console.log('ManajemenStok: Current User:', user);

  //     if (!user) {
  //       console.log('ManajemenStok: No user found, redirecting to login.');
  //       navigate('/admin-products'); // Adjust to your actual admin login route
  //       return;
  //     }

  //     const userRole = localStorage.getItem('userRole');
  //     console.log('ManajemenStok: User role from localStorage:', userRole);

  //     if (userRole !== 'admin') {
  //       alert('Anda tidak memiliki akses sebagai admin ke halaman ini!');
  //       console.log('ManajemenStok: User is not admin, redirecting to /homeuserlogin.');
  //       navigate('/homeuserlogin'); // Adjust to your actual non-admin home route
  //     }
  //   };

  //   checkUserAndRole();
  // }, [navigate]);

  // Function to fetch stock items from Supabase
  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('stocks') // Changed from 'products' to 'stocks'
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stock items:', error.message);
      setError('Gagal memuat data stok. Silakan coba lagi.');
    } else {
      setStocks(data);
      console.log('Stock items fetched:', data);
    }
    setLoading(false);
  };

  // Effect to load stock items and subscribe to real-time updates
  useEffect(() => {
    fetchStocks();

    // Subscribe to real-time changes on the 'stocks' table
    const channel = supabase
      .channel('public:stocks_admin_changes') // Channel name changed
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stocks' }, payload => { // Table name changed
        console.log('Realtime change received for Stocks (Admin):', payload);
        fetchStocks(); // Re-fetch all stock items to update the list
      })
      .subscribe();

    // Cleanup function to remove the channel when component unmounts
    return () => {
      console.log('Unsubscribing from stock changes.');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding or updating a stock item
  const handleAddOrUpdateStock = async () => {
    const { name, current_stock } = formData;

    if (!name.trim() || current_stock === "") {
      setError("Nama produk dan stok saat ini harus diisi.");
      return;
    }

    // Basic validation for current_stock to be a non-negative integer
    const stockValue = parseInt(current_stock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      setError("Stok saat ini harus berupa angka non-negatif.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stockData = {
        name: name.trim(),
        current_stock: stockValue,
      };

      console.log("handleAddOrUpdateStock: Final stock data for DB operation:", stockData);

      if (editId !== null) {
        // Update existing stock item
        console.log("handleAddOrUpdateStock: Updating stock item with ID:", editId);
        const { data, error } = await supabase
          .from('stocks') // Changed to 'stocks'
          .update(stockData)
          .eq('id', editId)
          .select();

        if (error) {
          console.error('handleAddOrUpdateStock: Error updating stock item:', error.message);
          setError('Gagal memperbarui stok. Silakan coba lagi: ' + error.message);
        } else {
          console.log('handleAddOrUpdateStock: Stock item updated successfully:', data);
          alert('Stok berhasil diperbarui!');
        }
      } else {
        // Add new stock item
        console.log("handleAddOrUpdateStock: Adding new stock item.");
        const { data, error } = await supabase
          .from('stocks') // Changed to 'stocks'
          .insert([stockData])
          .select();

        if (error) {
          console.error('handleAddOrUpdateStock: Error adding stock item:', error.message);
          setError('Gagal menambahkan stok. Silakan coba lagi: ' + error.message);
        } else {
          console.log('handleAddOrUpdateStock: Stock item added successfully:', data);
          alert('Stok berhasil ditambahkan!');
        }
      }

      // Reset form states after successful operation
      setFormData({ name: "", current_stock: "" });
      setShowForm(false); // Hide the form
      setEditId(null); // Clear edit ID
    } catch (e) {
      console.error("handleAddOrUpdateStock: Operation failed:", e.message, e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation modal before deleting
  const handleDeleteConfirm = (id) => {
    setItemIdToDelete(id);
    setShowConfirmModal(true);
  };

  // Execute deletion after confirmation
  const handleDelete = async () => {
    if (itemIdToDelete === null) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`HandleDelete: Deleting stock record with ID ${itemIdToDelete}.`);
      const { error: deleteRecordError } = await supabase
        .from('stocks') // Changed to 'stocks'
        .delete()
        .eq('id', itemIdToDelete);

      if (deleteRecordError) {
        console.error('HandleDelete: Error deleting stock record:', deleteRecordError.message);
        throw new Error('Gagal menghapus data stok.');
      }

      console.log(`HandleDelete: Stock ID ${itemIdToDelete} deleted successfully.`);
      alert('Stok berhasil dihapus!');
    } catch (e) {
      console.error("HandleDelete: Operation failed:", e.message, e);
      setError('Gagal menghapus data: ' + e.message);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setItemIdToDelete(null);
      // If the stock being edited was deleted, reset the form
      if (editId === itemIdToDelete) {
        setEditId(null);
        setShowForm(false);
        setFormData({ name: "", current_stock: "" });
      }
    }
  };

  // Handle stock item editing
  const handleEdit = (stock) => {
    console.log("HandleEdit: Editing stock item:", stock);
    setFormData({
      name: stock.name,
      current_stock: stock.current_stock,
    });
    setEditId(stock.id);
    setShowForm(true); // Show the form
    setError(null); // Clear previous errors
  };

  // Handle form or modal cancellation
  const handleCancel = () => {
    console.log("HandleCancel: Cancelling current operation.");
    setShowConfirmModal(false);
    setItemIdToDelete(null);
    setEditId(null); // Reset edit ID
    setShowForm(false); // Hide form
    setFormData({ name: "", current_stock: "" }); // Reset form data
    setError(null); // Clear errors
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen Stok
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
            onClick={() => {
              setShowForm(true);
              setEditId(null); // Ensure add new mode
              setFormData({ name: "", current_stock: "" }); // Reset form
              setError(null); // Clear error
            }}
            className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Tambah Stok Baru
          </button>
        )}

        {showForm && (
          <div className="mb-8 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {editId !== null ? "Edit Stok" : "Tambah Stok"}
            </h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium text-blue-800">
                Nama Produk
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Masukkan nama produk"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="current_stock" className="block mb-2 font-medium text-blue-800">
                Stok Saat Ini
              </label>
              <input
                type="number"
                id="current_stock"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., 100"
                min="0"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddOrUpdateStock}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {editId !== null ? "Simpan Perubahan" : "Simpan Stok"}
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

        {!loading && !error && stocks.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg relative mb-4 text-center">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada stok tersedia.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-blue-200 text-sm text-left text-gray-800">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl text-blue-800 font-semibold">Nama Produk</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Stok Saat Ini</th>
                  <th className="py-3 px-4 rounded-tr-xl text-center text-blue-800 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-3 px-4 font-medium">{stock.name}</td>
                    <td className="py-3 px-4">{stock.current_stock}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(stock)}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(stock.id)}
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Penghapusan</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus item stok ini? Tindakan ini tidak dapat dibatalkan.
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