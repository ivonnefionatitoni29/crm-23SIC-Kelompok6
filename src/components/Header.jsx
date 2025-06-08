import { useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  // Fungsi buat breadcrumb dinamis dari path
  const generateBreadcrumb = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) return 'Dashboard';

    return pathParts.map((part, idx) => {
      // Ganti dash (-) dengan spasi, huruf pertama kapital
      const label = part
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return (
        <span key={idx}>
          {label}
          {idx < pathParts.length - 1 && ' / '}
        </span>
      );
    });
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md border-b sticky top-0 z-20">
      {/* Breadcrumb / Page Title */}
      <div className="text-sm text-gray-600">
        Pages / <span className="text-green-700 font-semibold">{generateBreadcrumb()}</span>
      </div>


      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }}
        className="ml-6 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md transition"
        aria-label="Logout"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
