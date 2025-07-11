import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { supabase } from '../supabase';

const UserHeader = () => {
  const [showReservasiMenu, setShowReservasiMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleReservasiClick = () => setShowReservasiMenu(!showReservasiMenu);

  const fetchLoyaltyPoints = async (userId) => {
    if (!userId) return setLoyaltyPoints(0);
    const { data, error } = await supabase
      .from('dataloyalitas')
      .select('poinloyalitas')
      .eq('id_pelanggan', userId)
      .single();
    if (error) {
      console.error('Error fetching loyalty points:', error.message);
      setLoyaltyPoints(0);
    } else {
      setLoyaltyPoints(data?.poinloyalitas || 0);
    }
  };

  const getTotalItemsInCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Failed to parse cart:", error);
      return 0;
    }
  };

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId");
      const userEmail = localStorage.getItem("userEmail");
      const userRole = localStorage.getItem("userRole");
      const userNama = localStorage.getItem("username");

      if (isLoggedIn && userId && userEmail) {
        setCurrentUser({ id: userId, email: userEmail, role: userRole });
        setUsername(userNama || userEmail || "Pengguna");
        await fetchLoyaltyPoints(userId);
      } else {
        setCurrentUser(null);
        setUsername("Pengguna");
        setLoyaltyPoints(0);
        navigate("/login");
      }
    };

    checkUserAuthentication();
    setCartItemCount(getTotalItemsInCart());

    const loyaltyChannel = supabase
      .channel('public:dataloyalitas_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dataloyalitas' }, payload => {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) fetchLoyaltyPoints(currentUserId);
      })
      .subscribe();

    const handleStorageChange = (event) => {
      if (event.key === "cart") setCartItemCount(getTotalItemsInCart());
      if (["isLoggedIn", "userId", "userEmail", "username"].includes(event.key)) checkUserAuthentication();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      supabase.removeChannel(loyaltyChannel);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const formatPoints = (points) => points.toLocaleString('id-ID');

  if (currentUser === null && localStorage.getItem("isLoggedIn") === "true") return null;

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groovy VetCare</h1>
        <nav className="space-x-6 flex items-center">
          <Link to="/homeuserlogin" className="hover:underline">Beranda</Link>
          <Link to="/pelangganjb" className="hover:underline">Pembelian Produk</Link>
          <div className="relative">
            <button onClick={handleReservasiClick} className="hover:underline flex items-center gap-1">
              Layanan
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform duration-300 ${showReservasiMenu ? "rotate-180" : "rotate-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showReservasiMenu && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-xl z-10 overflow-hidden animate-fade-down">
                <Link to="/form-penitipan" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Penitipan Hewan</Link>
                <Link to="/form-kebiri" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Kebiri</Link>
                <Link to="/form-vaksinasi" onClick={() => setShowReservasiMenu(false)} className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition">Vaksinasi</Link>
              </div>
            )}
          </div>
          <Link to="/faq-page" className="hover:underline" onClick={() => setShowReservasiMenu(false)}>FAQ</Link>
          <div className="flex items-center space-x-2">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profil" className="w-8 h-8 rounded-full" />
            <span>{username || "Pengguna"}</span>
          </div>
          {loyaltyPoints > 0 && (
            <Link to="/loyalty" className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold hover:bg-yellow-600 transition-colors">
              Poin: {formatPoints(loyaltyPoints)} ⭐
            </Link>
          )}
          <Link to="/pelangganjb" className="relative bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-300">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">{cartItemCount}</span>
            )}
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/homeuser";
            }}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default UserHeader;
