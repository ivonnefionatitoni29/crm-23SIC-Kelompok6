import { LayoutDashboard } from 'lucide-react';
import { FaDog, FaQuestionCircle, FaStore } from 'react-icons/fa';
import { MdVaccines, MdEmojiEvents } from 'react-icons/md';
import { GiScalpel } from 'react-icons/gi';

import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { name: 'Penitipan Hewan', icon: <FaDog size={18} />, path: '/penitipan' },
  { name: 'Vaksinasi', icon: <MdVaccines size={18} />, path: '/vaksinasi' },
  { name: 'FAQ', icon: <FaQuestionCircle size={18} />, path: '/faq' },
  { name: 'Loyalitas Pelanggan', icon: <MdEmojiEvents size={18} />, path: '/loyalitaspelanggan' },
  { name: 'Kebiri', icon: <GiScalpel size={18} />, path: '/kebiri' },
  { name: 'Jual Beli', icon: <FaStore size={18} />, path: '/jualbeli' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-green-100 w-64 shadow-lg px-4 py-6 hidden md:flex flex-col h-screen overflow-y-auto">
      <div className="text-xl font-bold mb-8 text-green-900">KLINIK HEWAN GROOVY VETCARE</div>

      <nav className="space-y-1 text-base">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(item.path)
              ? 'bg-green-300 text-green-900 font-semibold'
              : 'text-green-800 hover:bg-green-200'
              }`}
          >
            <span className="w-[18px] h-[18px] flex items-center justify-center">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
