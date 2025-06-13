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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rekapan Pembelian Makanan & Obat Hewan</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nama Item</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Jenis</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Harga (Rp)</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Jumlah</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Total (Rp)</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataPembelian.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.namaItem}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2 text-right">Rp {item.harga.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{item.jumlah}</td>
                <td className="px-4 py-2 text-right font-semibold">Rp {item.total.toLocaleString()}</td>
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
