import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Star,
  Search,
} from "lucide-react";
import { supabase } from '../supabase'; // Import instance supabase

const PetStoreApp = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Pengguna");

  // Data produk dummy (bisa diambil dari Supabase juga)
  useEffect(() => {
    const initialProducts = [
      {
        id: 1,
        name: "Royal Canin Adult Dog Food",
        category: "makanan",
        type: "anjing",
        price: 285000,
        originalPrice: 320000,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit:crop",
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
        image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=300&h=300&fit:crop",
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
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit:crop",
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
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit:crop",
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
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit:crop",
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
        image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit:crop",
        rating: 4.4,
        reviews: 98,
        description: "Obat cacing spektrum luas untuk anjing dan kucing dewasa",
      },
    ];
    setProducts(initialProducts);
  }, []);

  // Efek samping untuk mengambil informasi pengguna dari localStorage
  useEffect(() => {
    const getUserFromLocalStorage = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const userNama = localStorage.getItem("userNama");
      const userRole = localStorage.getItem("userRole");

      if (isLoggedIn && userId && userEmail) {
        setCurrentUser({ id: userId, email: userEmail, role: userRole });
        setCurrentUserName(userNama || userEmail || "Pengguna");
      } else {
        setCurrentUser(null);
        setCurrentUserName("Pengguna");
        navigate("/login");
      }
    };

    getUserFromLocalStorage();
  }, [navigate]);

  const categories = [
    { id: "all", name: "Semua Produk" },
    { id: "makanan", name: "Makanan Hewan" },
    { id: "obat", name: "Obat & Vitamin" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = searchTerm === "" || product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
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
          <span className="text-xl font-bold text-[#2563EB]">
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
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );

  const CartModal = () => (
    <div className="fixed inset-0 bg-gradient-to-tr from-blue-100 via-white to-blue-200 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-300">
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
                  className="flex items-center gap-3 py-3 border-b border-gray-300 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                    <p className="text-[#2563EB] font-semibold">
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
                      className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#3B82F6] transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-xl text-[#2563EB]">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white py-3 rounded-lg font-semibold transition"
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
        // Hapus baris 'alamat' karena kolomnya sudah tidak ada di Supabase
        tanggal: new Date().toISOString(),
        id_pelanggan: loggedInUserId,
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
        // Pelanggan belum ada, masukkan data baru
        const { error: insertLoyaltyError } = await supabase
          .from('dataloyalitas')
          .insert({
            id_pelanggan: localStorage.getItem("userId"),
            poinloyalitas: pointsEarnedThisPurchase,
            totalbelanja: totalPurchaseAmount,
            jumlahtransaksi: 1,
            // Supabase akan otomatis mengisi created_at jika defaultnya now()
          });

        if (insertLoyaltyError) {
          console.error("Error inserting new loyalty data:", insertLoyaltyError);
          alert("Terjadi kesalahan saat menambahkan data loyalitas baru: " + insertLoyaltyError.message);
        }
      }

      alert("Pesanan berhasil! Terima kasih atas pembelian Anda.");

      setCart([]); // Kosongkan keranjang setelah checkout
      setShowCheckout(false);
      navigate("/homeuserlogin"); // Navigasi ke halaman user login setelah checkout
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Konfirmasi Pesanan</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-semibold text-gray-700 mb-3">Detail Pesanan Anda:</h4>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada item di keranjang.</p>
            ) : (
              <ul className="space-y-2 border-b pb-4 mb-4">
                {cart.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-800 font-medium">{item.name} (x{item.quantity})</span>
                    <span className="text-gray-600">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total Pembayaran:</span>
                <span className="font-bold text-xl text-[#2563EB]">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white py-3 rounded-lg font-semibold transition"
              >
                Konfirmasi & Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
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

            <div className="flex items-center space-x-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profil"
                className="w-8 h-8 rounded-full"
              />
              <span>{currentUserName}</span>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="relative bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userId");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userNama");
                localStorage.removeItem("userRole");
                setCurrentUser(null);
                setCurrentUserName("Pengguna");
                navigate("/login");
              }}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk makanan atau obat hewan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-[#2563EB] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Tidak ada produk yang ditemukan
            </p>
          </div>
        )}
      </div>

      <footer className="bg-blue-700 text-white py-10 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-3">Groovy Vetcare Clinic</h3>
            <p className="mb-1">Ruko Galeri Niaga No. 9F-G</p>
            <p className="mb-1">Jl. Haji Nawi Raya, Kel. Gandaria Selatan,</p>
            <p className="mb-2">Kec. Cilandak, Jakarta Selatan</p>
            <div className="space-y-1">
              <p>📞 +6221-7280-0617</p>
              <p>📱 +62 811-4110-440</p>
            </div>
            <p>📧 groovyvetcare@medivet.pet</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-pink-600 mt-4 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              Google Maps Direction
            </a>
          </div>

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

          <div className="bg-white rounded-xl shadow-lg p-5 text-gray-800">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
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

        <div className="mt-8 text-center text-xs text-white/80">
          © 2025 Groovy Vetcare. All rights reserved.
        </div>
      </footer>

      {showCart && <CartModal />}
      {showCheckout && <CheckoutModal />}
    </div>
  );
};

export default PetStoreApp;
