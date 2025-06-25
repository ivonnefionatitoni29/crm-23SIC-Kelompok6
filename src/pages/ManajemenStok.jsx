import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Pastikan path ini benar

export default function ManajemenStok() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockChange, setStockChange] = useState("");
  const [stockReason, setStockReason] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // Untuk menyimpan user saat ini untuk logging

  // Cek User dan Role
  useEffect(() => {
    const checkUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user); // Set user saat ini

      if (!user) {
        console.log('ManajemenStok: Tidak ada user ditemukan, mengarahkan ke login.');
        navigate('/admin/stock-management'); // Sesuaikan dengan rute login admin Anda
        return;
      }

      const userRole = localStorage.getItem('userRole');
      console.log('ManajemenStok: Role user dari localStorage:', userRole);

      if (userRole !== 'admin') {
        alert('Anda tidak memiliki akses sebagai admin ke halaman ini!');
        console.log('ManajemenStok: User bukan admin, mengarahkan ke /homeuserlogin.');
        navigate('/homeuserlogin'); // Sesuaikan dengan rute non-admin Anda
      }
    };

    checkUserAndRole();
  }, [navigate]);

  // Fungsi untuk mengambil produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock_quantity') // Hanya ambil kolom yang dibutuhkan
      .order('name', { ascending: true });

    if (error) {
      console.error('Error mengambil produk untuk manajemen stok:', error.message);
      setError('Gagal memuat produk untuk manajemen stok. Silakan coba lagi.');
    } else {
      setProducts(data);
      console.log('Produk berhasil diambil untuk manajemen stok:', data);
    }
    setLoading(false);
  };

  // Efek untuk memuat produk dan berlangganan pembaruan real-time
  useEffect(() => {
    fetchProducts();

    // Berlangganan perubahan real-time pada tabel 'products'
    const channel = supabase
      .channel('public:products_stock_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        console.log('Perubahan real-time diterima untuk Produk (Manajemen Stok):', payload);
        // Hanya ambil ulang jika perubahan relevan dengan stok (misalnya, insert, update yang memengaruhi stock_quantity, atau delete)
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
          fetchProducts();
        }
      })
      .subscribe();

    // Fungsi cleanup untuk menghapus channel saat komponen di-unmount
    return () => {
      console.log('Berhenti berlangganan perubahan produk untuk manajemen stok.');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenUpdateForm = (product) => {
    setSelectedProduct(product);
    setStockChange("");
    setStockReason("");
    setShowUpdateForm(true);
    setError(null); // Hapus error sebelumnya
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct || stockChange === "") {
      setError("Silakan pilih produk dan masukkan jumlah perubahan stok.");
      return;
    }

    const changeValue = parseInt(stockChange, 10);
    if (isNaN(changeValue) || changeValue === 0) {
      setError("Silakan masukkan angka non-nol yang valid untuk perubahan stok.");
      return;
    }

    // Hitung jumlah stok baru
    const newQuantity = selectedProduct.stock_quantity + changeValue;

    if (newQuantity < 0) {
      if (!window.confirm(`Stok akan menjadi ${newQuantity}. Anda yakin ingin melanjutkan? (Stok minus)`)) {
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Perbarui jumlah stok produk di tabel 'products'
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', selectedProduct.id)
        .select();

      if (updateError) {
        console.error('Error memperbarui jumlah stok:', updateError.message);
        throw new Error('Gagal memperbarui jumlah stok: ' + updateError.message);
      }

      console.log("Jumlah stok berhasil diperbarui:", updatedProduct);

      // 2. (Opsional) Catat pergerakan stok di tabel 'stock_movements'
      const { error: logError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: selectedProduct.id,
          change_type: changeValue > 0 ? 'inbound' : (changeValue < 0 ? 'outbound' : 'adjustment'), // Tentukan tipe
          quantity_change: changeValue,
          new_stock_quantity: newQuantity,
          reason: stockReason.trim() === "" ? null : stockReason.trim(),
          changed_by_user_id: currentUser ? currentUser.id : null, // Catat user yang melakukan perubahan
        });

      if (logError) {
        console.error('Error mencatat pergerakan stok:', logError.message);
        // Jangan throw error di sini, karena update stok utama sudah berhasil.
        // Cukup catat masalah dengan tabel logging.
      } else {
        console.log("Pergerakan stok berhasil dicatat.");
      }

      alert('Stok berhasil diperbarui!');
      setShowUpdateForm(false);
      fetchProducts(); // Ambil ulang untuk mendapatkan jumlah stok terbaru
    } catch (e) {
      console.error("Operasi pembaruan stok gagal:", e.message, e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowUpdateForm(false);
    setSelectedProduct(null);
    setStockChange("");
    setStockReason("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Manajemen Stok Produk
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {loading && (
          <p className="text-center text-lg text-blue-600 mb-4">Memuat data stok...</p>
        )}

        {showUpdateForm && (
          <div className="mb-8 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Perbarui Stok untuk "{selectedProduct?.name}"
            </h2>
            <div className="mb-4">
              <label htmlFor="currentStock" className="block mb-2 font-medium text-blue-800">
                Stok Saat Ini:
              </label>
              <input
                type="text"
                id="currentStock"
                value={selectedProduct?.stock_quantity}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="stockChange" className="block mb-2 font-medium text-blue-800">
                Jumlah Perubahan (misalnya, +10 atau -5)
              </label>
              <input
                type="number"
                id="stockChange"
                name="stockChange"
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Masukkan positif untuk menambah, negatif untuk mengurangi"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="stockReason" className="block mb-2 font-medium text-blue-800">
                Alasan Perubahan (Opsional)
              </label>
              <textarea
                id="stockReason"
                name="stockReason"
                value={stockReason}
                onChange={(e) => setStockReason(e.target.value)}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Misalnya, Pengiriman baru, stok rusak, pengembalian pelanggan"
                rows={2}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdateStock}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Simpan Perubahan Stok
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

        {!loading && !error && products.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg relative mb-4 text-center">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> Tidak ada produk yang tersedia untuk manajemen stok.</span>
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${product.stock_quantity <= 5 && product.stock_quantity >=0 ? 'text-orange-500' : product.stock_quantity < 0 ? 'text-red-600' : 'text-green-700'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenUpdateForm(product)}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Perbarui Stok
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}