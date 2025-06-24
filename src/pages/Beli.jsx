import React, { useState, useEffect } from "react";
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LoaderCircle, AlertTriangle } from 'lucide-react';

export default function RekapPembelian() {
  const [dataPembelian, setDataPembelian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Keep user state to potentially display email if logged in
  const navigate = useNavigate();

  // Fungsi untuk memformat harga ke dalam format Rupiah (IDR)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const getPurchaseData = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors

      // // Get current session to identify the user
      // const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // if (sessionError) {
      //   console.error("Session Error:", sessionError.message);
      //   setError("Terjadi masalah saat memeriksa sesi pengguna.");
      //   setUser(null);
      //   setDataPembelian([]);
      //   setLoading(false);
      //   return;
      // }
      
      // setUser(session?.user || null); // Set user to session.user or null if no session

      // Build the Supabase query to fetch purchase data and join with user data
      // 'id_pelanggan' in 'datapembelian' table should reference 'id' in 'users' table
      let query = supabase
        .from('datapembelian')
        // Select all columns from datapembelian and 'nama' from the joined 'users' table
        // This assumes a foreign key relationship between datapembelian.id_pelanggan and users.id
        .select('*, users(nama)') // <--- Added users(nama) for the join
        .order('tanggal', { ascending: false });

      // Optional: Filter by user ID if you only want to show purchases for the logged-in user
      // Uncomment and ensure 'id_pelanggan' is the correct foreign key column name in your 'datapembelian' table.
      // if (session?.user?.id) {
      //    query = query.eq('id_pelanggan', session.user.id);
      // } else {
      //    // If no user is logged in, and we're filtering by user_id, there will be no data.
      //    // You might want to display a message saying "Please login to view your purchases."
      //    setDataPembelian([]);
      //    setLoading(false);
      //    return;
      // }


      const { data, error: fetchDataError } = await query;

      if (fetchDataError) {
        console.error("Fetch Error:", fetchDataError.message);
        setError("Gagal memuat data pembelian.");
        setDataPembelian([]);
      } else {
        setDataPembelian(data);
      }
      setLoading(false);
    };

    getPurchaseData();

    // Use auth listener to reload data if login/logout status changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          getPurchaseData(); // Reload data based on new session status
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount,
          // and the auth listener handles subsequent updates.

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
           <button 
             onClick={() => navigate('/pet-store')} // Asumsi halaman toko Anda ada di /pet-store
             className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
           >
             <ArrowLeft size={20} />
             Kembali ke Toko
           </button>
           <div>
             <h1 className="text-xl font-semibold text-gray-800">Riwayat Pembelian Anda</h1>
             {user && <p className="text-sm text-gray-500">Logged in as: {user.email}</p>}
           </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20 gap-3">
            <LoaderCircle className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tampilkan data hanya jika tidak sedang memuat dan tidak ada error umum */}
        {!loading && !error && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              {dataPembelian.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">Tanggal</th>
                      <th scope="col" className="px-6 py-3">User</th> {/* New column for user name */}
                      <th scope="col" className="px-6 py-3">Nama Item</th>
                      <th scope="col" className="px-6 py-3">Jenis</th>
                      <th scope="col" className="px-6 py-3 text-right">Harga Satuan</th>
                      <th scope="col" className="px-6 py-3 text-center">Jumlah</th>
                      <th scope="col" className="px-6 py-3 text-right">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPembelian.map((item) => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {formatDate(item.tanggal)}
                        </td>
                        {/* Display the user's name from the joined 'users' table */}
                        <td className="px-6 py-4">
                            {item.users ? item.users.nama || 'N/A' : 'Unknown User'} 
                        </td>
                        <td className="px-6 py-4">{item.nama_item}</td> {/* Corrected to nama_item */}
                        <td className="px-6 py-4 capitalize">{item.jenis}</td>
                        <td className="px-6 py-4 text-right">{formatPrice(item.harga)}</td>
                        <td className="px-6 py-4 text-center">{item.jumlah}</td>
                        <td className="px-6 py-4 text-right font-semibold text-blue-700">
                          {formatPrice(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-12">
                  Anda belum memiliki riwayat pembelian.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
