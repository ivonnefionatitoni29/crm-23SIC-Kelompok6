import { RiHospitalFill, RiHotelFill } from "react-icons/ri";
import { GiRoyalLove } from "react-icons/gi";
import {
  LayoutDashboard,
  Settings,
  User,
  LogIn,
  UserPlus,
} from 'lucide-react';

import iconKebiri from '../assets/iconKebiri.png';
import cart from '../assets/cart.png';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
  { name: 'Penitipan Hewan', icon: <RiHotelFill />, path: '/penitipan' },
  { name: 'Vaksinasi', icon: <RiHospitalFill />, path: '/vaksinasi' },
  { name: 'FAQ', icon: <User />, path: '/faq' },
  { name: 'LoyalitasPelanggan', icon: <GiRoyalLove />, path: '/loyalitaspelanggan' },
  { name: 'Kebiri', icon: <img src={iconKebiri} alt="kebiri" className="w-5 h-5" />, path: '/kebiri' },
  { name: 'Jual Beli', icon: <img src={cart} alt="jual beli" className="w-5 h-5" />, path: '/jualbeli' },
];

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-white w-64 shadow-lg px-4 py-6 hidden md:flex flex-col h-screen overflow-y-auto">
      <div className="text-xl font-bold mb-8 text-green-700">KLINIK HEWAN GROOVY VETCARE</div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-100 transition ${
              isActive(item.path)
                ? 'bg-purple-200 text-purple-800 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 text-xs font-semibold text-gray-500">AKUN</div>
      <nav className="mt-2 space-y-1">
        {accountItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-100 transition ${
              isActive(item.path)
                ? 'bg-purple-200 text-purple-800 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
