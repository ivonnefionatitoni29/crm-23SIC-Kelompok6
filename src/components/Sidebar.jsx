import { LayoutDashboard } from 'lucide-react';
import { FaDog, FaQuestionCircle, FaStore, FaUser, FaHeartbeat } from 'react-icons/fa';
import { MdVaccines, MdEmojiEvents } from 'react-icons/md';
import { GiScalpel } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';
import { BiBox } from 'react-icons/bi';
import { RiStockLine } from 'react-icons/ri';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { name: 'Penitipan Hewan', icon: <FaDog size={18} />, path: '/penitipan' },
  { name: 'Vaksinasi', icon: <MdVaccines size={18} />, path: '/vaksinasi' },
  { name: 'Kebiri', icon: <GiScalpel size={18} />, path: '/kebiri' },
  { name: 'Loyalitas Pelanggan', icon: <MdEmojiEvents size={18} />, path: '/loyalitaspelanggan' },
  { name: 'FAQ', icon: <FaQuestionCircle size={18} />, path: '/faq' },
  { name: 'Jual Beli', icon: <FaStore size={18} />, path: '/jualbeli' },
  { name: 'Tabel User', icon: <FaUser size={18} />, path: '/users' },
  { name: 'Product CRUD', icon: <BiBox size={18} />, path: '/admin-products' },
  { name: 'Manajemen Stok', icon: <RiStockLine size={18} />, path: '/admin/stock-management' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="bg-gradient-to-b from-blue-50 to-blue-100 w-64 shadow-2xl px-0 py-0 hidden md:flex flex-col h-screen overflow-y-auto border-r border-blue-200">
      {/* Header */}
      <div className="px-6 py-8 border-b border-blue-200/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FaHeartbeat className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-blue-900 font-bold text-lg leading-tight">GROOVY</h1>
            <p className="text-blue-700 text-sm font-medium">VETCARE</p>
          </div>
        </div>
        <p className="text-blue-600 text-xs mt-2">Sistem Manajemen Klinik Hewan</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-300/60 to-blue-400/40 text-blue-900 shadow-lg border border-blue-300/50'
                : 'text-blue-700 hover:bg-blue-200/60 hover:text-blue-900'
            }`}
          >
            {/* Active indicator */}
            {isActive(item.path) && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
            )}
            
            <span className={`w-5 h-5 flex items-center justify-center transition-all duration-200 ${
              isActive(item.path) 
                ? 'text-blue-700' 
                : 'text-blue-600 group-hover:text-blue-900'
            }`}>
              {item.icon}
            </span>
            
            <span className={`font-medium text-sm transition-all duration-200 ${
              isActive(item.path) 
                ? 'text-blue-900 font-semibold' 
                : 'text-blue-700 group-hover:text-blue-900'
            }`}>
              {item.name}
            </span>

            {/* Hover effect */}
            {!isActive(item.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-blue-200/50">
        <div className="text-xs text-blue-600 text-center">
          <p>© 2024 Groovy Vetcare</p>
          <p className="mt-1">Sistem Manajemen Terintegrasi</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;