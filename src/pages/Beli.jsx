import React, { useState, useEffect } from "react";
import { supabase } from '../supabase';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

export default function RekapPembelian() {
  const [dataPembelian, setDataPembelian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const getPurchaseData = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('datapembelian')
        .select('*, users(nama)')
        .order('tanggal', { ascending: false });

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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
        getPurchaseData();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Header Tengah */}
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Riwayat Pembelian
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20 gap-3">
            <LoaderCircle className="animate-spin text-blue-600" size={32} />
            <p className="text-blue-600">Memuat data...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-3" role="alert">
            <AlertTriangle size={24} />
            <div>
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tabel Data */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            {dataPembelian.length > 0 ? (
              <table className="min-w-full divide-y divide-blue-200 text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-blue-800">Tanggal</th>
                    <th className="px-4 py-3 text-left text-blue-800">Pelanggan</th>
                    <th className="px-4 py-3 text-left text-blue-800">Nama Item</th>
                    <th className="px-4 py-3 text-left text-blue-800">Jenis</th>
                    <th className="px-4 py-3 text-right text-blue-800">Harga</th>
                    <th className="px-4 py-3 text-center text-blue-800">Jumlah</th>
                    <th className="px-4 py-3 text-right text-blue-800">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 bg-white">
                  {dataPembelian.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="px-4 py-3 text-gray-700">{formatDate(item.tanggal)}</td>
                      <td className="px-4 py-3 text-gray-700">{item.users?.nama || 'Unknown'}</td>
                      <td className="px-4 py-3 text-gray-700">{item.nama_item}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{item.jenis}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatPrice(item.harga)}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{item.jumlah}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-700">{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative text-center">
                <p className="font-semibold">Belum ada data pembelian.</p>
                <p className="text-sm">Riwayat akan muncul setelah Anda melakukan pembelian.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
