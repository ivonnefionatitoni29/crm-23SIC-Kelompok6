import React, { useState, useEffect } from "react";
import { Crown, BarChart2, TrendingUp, TrendingDown } from "lucide-react";

export default function RekapLoyalitas() {
  const [dataLoyalitas, setDataLoyalitas] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {

    const initialProducts = [
      {
        id: 1,
        name: "Royal Canin Adult Dog Food",
        category: "makanan",
        type: "anjing",
        price: 285000,
        originalPrice: 320000,
        image:
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop",
        rating: 4.8,
        reviews: 156,
        description: "Makanan premium untuk anjing dengan nutrisi seimbang",
      },
      {
        id: 2,
        name: "Whiskas Cat Food Tuna",
        category: "makanan",
        type: "kucing",
        price: 45000,
        originalPrice: 52000,
        image:
          "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=300&h=300&fit=crop",
        rating: 4.5,
        reviews: 203,
        description: "Makanan kucing rasa tuna yang lezat dan bergizi",
      },
      {
        id: 3,
        name: "Antibiotik Amoxicillin",
        category: "obat",
        type: "umum",
        price: 125000,
        originalPrice: 145000,
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
        rating: 4.7,
        reviews: 89,
        description: "Antibiotik untuk mengobati infeksi bakteri pada hewan",
      },
      {
        id: 4,
        name: "Vitamin Pet Health Plus",
        category: "obat",
        type: "vitamin",
        price: 85000,
        originalPrice: 95000,
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
        rating: 4.6,
        reviews: 67,
        description: "Suplemen vitamin untuk kesehatan hewan peliharaan",
      },
      {
        id: 5,
        name: "Pro Plan Puppy Food",
        category: "makanan",
        type: "anjing",
        price: 195000,
        originalPrice: 220000,
        image:
          "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit:crop",
        rating: 4.9,
        reviews: 134,
        description: "Makanan untuk anjing dengan DHA dan protein tinggi",
      },
      {
        id: 6,
        name: "Obat Cacing Drontal",
        category: "obat",
        type: "dewasa",
        price: 75000,
        originalPrice: 85000,
        image:
          "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop",
        rating: 4.4,
        reviews: 98,
        description: "Obat cacing spektrum luas untuk anjing dan kucing dewasa",
      },
    ];
    setProducts(initialProducts);

    const savedData = JSON.parse(localStorage.getItem("dataLoyalitas")) || [];
    const sortedData = [...savedData].sort((a, b) => b.poinLoyalitas - a.poinLoyalitas);
    setDataLoyalitas(sortedData);

  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    const sortedData = [...dataLoyalitas].sort((a, b) => {
      return newSortOrder === "desc"
        ? b.poinLoyalitas - a.poinLoyalitas
        : a.poinLoyalitas - b.poinLoyalitas;
    });
    setDataLoyalitas(sortedData);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,

    }).format(price);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            favorites.includes(product.id)
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-red-50"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={favorites.includes(product.id) ? "currentColor" : "none"}
          />
        </button>
        {product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            DISKON
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-[#08a43c]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-[#08a43c] hover:bg-[#067a2f] text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );

  const CartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Keranjang Belanja</h3>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Keranjang masih kosong</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 border-b last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-[#08a43c] font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-[#08a43c] text-white flex items-center justify-center hover:bg-[#067a2f] transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-xl text-[#08a43c]">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full bg-[#08a43c] hover:bg-[#067a2f] text-white py-3 rounded-lg font-semibold transition"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const CheckoutModal = () => {
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState({
      name: "", // Initialized empty, will be filled from localStorage
      phone: "",
      address: "",
      paymentMethod: "transfer",
    });

    // Load username from localStorage when the modal mounts
    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setCustomerInfo(prevInfo => ({ ...prevInfo, name: storedUsername }));
      }
    }, []); // Empty dependency array means this runs once on mount

    const handleSubmit = () => {
      // Check if phone or address are empty (name is now auto-filled)
      if (!customerInfo.phone || !customerInfo.address) {
        alert("Mohon lengkapi Nomor Telepon dan Alamat!"); // Updated alert message
        return;
      }

      const totalBelanjaSaatIni = getTotalPrice();

      // --- [BAGIAN 1] - SIMPAN REKAP PEMBELIAN ---
      const existingPurchases = JSON.parse(localStorage.getItem("dataPembelian")) || [];
      const newPurchases = cart.map((item, index) => ({
        id: Date.now() + index, // Membuat ID unik berdasarkan waktu
        namaItem: item.name,
        jenis: item.category,
        tanggal: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        harga: item.price,
        jumlah: item.quantity,
        total: item.price * item.quantity,
        // Tambahan info pelanggan untuk setiap item
        pelanggan: {
          nama: customerInfo.name, // Use the name from localStorage (which is hidden)
          telepon: customerInfo.phone,
          alamat: customerInfo.address,
        },
      }));

      // Gabungkan data lama dengan data baru
      const updatedPurchases = [...existingPurchases, ...newPurchases];
      localStorage.setItem("dataPembelian", JSON.stringify(updatedPurchases));
      // --- AKHIR BAGIAN 1 ---

      // --- [BAGIAN 2] - LOGIKA LOYALITAS PELANGGAN ---
      let dataLoyalitas = JSON.parse(localStorage.getItem("dataLoyalitas")) || [];
      const idPelanggan = customerInfo.phone; // Still using phone as ID for loyalty
      const indexPelanggan = dataLoyalitas.findIndex(p => p.id === idPelanggan);
      const poinBaru = Math.floor(totalBelanjaSaatIni / 10000);

      if (indexPelanggan > -1) {
        // Jika pelanggan sudah ada
        dataLoyalitas[indexPelanggan].poinLoyalitas += poinBaru;
        dataLoyalitas[indexPelanggan].totalBelanja += totalBelanjaSaatIni;
        dataLoyalitas[indexPelanggan].jumlahTransaksi += 1;
        dataLoyalitas[indexPelanggan].namaPelanggan = customerInfo.name; // Ensure name is updated/consistent
      } else {
        // Jika pelanggan baru
        dataLoyalitas.push({
          id: idPelanggan,
          namaPelanggan: customerInfo.name,
          poinLoyalitas: poinBaru,
          totalBelanja: totalBelanjaSaatIni,
          jumlahTransaksi: 1,
        });
      }

      localStorage.setItem("dataLoyalitas", JSON.stringify(dataLoyalitas));
      // --- AKHIR BAGIAN 2 ---

      alert("Pesanan berhasil! Poin loyalitas telah ditambahkan.");
      setCart([]);
      setShowCheckout(false);
      navigate("/homeuserlogin"); // Navigasi ke halaman user login setelah checkout
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {/* Bagian input Nama Lengkap dihilangkan dari tampilan */}
              {/* <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08a43c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      address: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08a43c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={customerInfo.paymentMethod}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08a43c] focus:border-transparent"
                >
                  <option value="transfer">Transfer Bank</option>
                  <option value="cod">Bayar di Tempat (COD)</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total Pembayaran:</span>
                <span className="font-bold text-xl text-[#08a43c]">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#08a43c] hover:bg-[#067a2f] text-white py-3 rounded-lg font-semibold transition"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold">Groovy VetCare</h1>

          {/* Navigation */}
          <nav className="space-x-6 flex items-center">
            <Link to="/homeuserlogin" className="hover:underline">
              Beranda
            </Link>
            <Link to="/homeuserlogin" className="hover:underline">
              Layanan
            </Link>
            <Link to="/homeuserlogin" className="hover:underline">
              FAQ
            </Link>

            {/* Profil + Username */}
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profil"
                className="w-8 h-8 rounded-full"
              />
              <span>{localStorage.getItem("username") || "Pengguna"}</span>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="relative bg-[#08a43c] hover:bg-[#067a2f] text-white p-3 rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Tombol Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                window.location.href = "/login";
              }}
              className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </nav>

    }).format(angka);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center">
            <Crown className="mr-3 text-blue-500" />
            Rekapitulasi Loyalitas Pelanggan
          </h1>
          <button
            onClick={handleSort}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {sortOrder === "desc" ? (
              <TrendingDown className="mr-2 h-4 w-4" />
            ) : (
              <TrendingUp className="mr-2 h-4 w-4" />
            )}
            Urutkan Poin
          </button>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Peringkat</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Nama Pelanggan</th>
                <th className="px-4 py-3 text-left font-semibold text-blue-700">Nomor Telepon</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700">Poin Loyalitas</th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700">Total Belanja</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-700">Jumlah Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 bg-white">
              {dataLoyalitas.length > 0 ? (
                dataLoyalitas.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-lg ${index < 3 ? 'text-blue-700' : 'text-blue-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-900">{item.namaPelanggan}</td>
                    <td className="px-4 py-3 text-blue-700">{item.id}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700">{item.poinLoyalitas.toLocaleString()} Poin</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatRupiah(item.totalBelanja)}</td>
                    <td className="px-4 py-3 text-center text-blue-600">{item.jumlahTransaksi} kali</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-blue-400">
                    <BarChart2 className="mx-auto h-12 w-12 text-blue-300" />
                    <p className="mt-2">Belum ada data loyalitas pelanggan.</p>
                    <p className="text-sm">Data akan muncul setelah ada transaksi pertama.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-green-700 text-white py-10 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Info Klinik */}
          <div>
            <h3 className="text-xl font-bold mb-3">Groovy Vetcare Clinic</h3>
            <p className="mb-1">Ruko Galeri Niaga No. 9F-G</p>
            <p className="mb-1">Jl. Haji Nawi Raya, Kel. Gandaria Selatan,</p>
            <p className="mb-2">Kec. Cilandak, Jakarta Selatan</p>
            <div className="space-y-1">
              <p>📞 +6221-7280-0617</p>
              <p>📱 +62 811-4110-440</p>
              <p>📧 groovyvetcare@medivet.pet</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-600 mt-4 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              📍 Google Maps Direction
            </a>
          </div>

          {/* Tentang Kami */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-3">Tentang Kami</h3>
            <p className="mb-3">
              Groovy Vetcare Clinic adalah bagian dari jaringan MEDIVET Pet
              Hospital & Clinic Network.
            </p>
            <p>
              Kami juga bagian dari Groovy Group yang berfokus pada layanan
              hewan seperti Pet Shop, Klinik, Transportasi Hewan, Pet Hotel, dan
              Cat Cafe.
            </p>
          </div>

          {/* Jam Layanan */}
          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
              🕒 Service Hours
            </h3>
            <ul className="text-sm divide-y divide-gray-200">
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 Monday – Saturday</span>
                <span className="text-gray-700">09:00 - 19:30 WIB</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 Sunday</span>
                <span className="text-gray-700">10:00 - 15:30 WIB</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="font-medium">📅 National Holidays</span>
                <span className="text-gray-700">10:00 - 15:30 WIB</span>
              </li>
            </ul>
            <div className="mt-5 bg-red-600 text-white text-center p-4 rounded-lg">
              <p className="font-bold text-base">
                🚨 Emergency Service 24 Hours
              </p>
              <p className="text-sm mt-1 italic text-gray-100">
                Temporarily Unavailable
              </p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 text-center text-xs text-white/80">
          © 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {showCart && <CartModal />}
      {showCheckout && <CheckoutModal />}
    </div>
  );
};

export default PetStoreApp;

    </div>
  );
}

