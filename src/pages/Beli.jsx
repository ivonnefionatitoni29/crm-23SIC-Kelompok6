import React, { useState } from "react";

export default function RekapPembelian() {
  const [dataPembelian, setDataPembelian] = useState([
    {
      id: 1,
      namaItem: "Royal Canin Kitten",
      jenis: "Makanan",
      tanggal: "2025-06-10",
      harga: 75000,
      jumlah: 2,
      total: 150000,
    },
    {
      id: 2,
      namaItem: "Obat Cacing Kucing",
      jenis: "Obat",
      tanggal: "2025-06-11",
      harga: 30000,
      jumlah: 1,
      total: 30000,
    },
  ]);

  const handleHapus = (id) => {
    setDataPembelian(dataPembelian.filter((item) => item.id !== id));
  };

  const totalKeseluruhan = dataPembelian.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-green-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Rekapan Pembelian Makanan & Obat Hewan
        </h1>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">Nama Item</th>
              <th className="px-4 py-2 text-left">Jenis</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-right">Harga (Rp)</th>
              <th className="px-4 py-2 text-right">Jumlah</th>
              <th className="px-4 py-2 text-right">Total (Rp)</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dataPembelian.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.namaItem}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2 text-right">
                  Rp {item.harga.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">{item.jumlah}</td>
                <td className="px-4 py-2 text-right font-medium">
                  Rp {item.total.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleHapus(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {dataPembelian.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Tidak ada data pembelian.
                </td>
              </tr>
            )}
          </tbody>
          {dataPembelian.length > 0 && (
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={6} className="px-4 py-2 text-right font-bold">
                  Total Keseluruhan:
                </td>
                <td className="px-4 py-2 text-right font-bold text-green-700">
                  Rp {totalKeseluruhan.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
