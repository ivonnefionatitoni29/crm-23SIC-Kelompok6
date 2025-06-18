import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const generateBreadcrumb = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) return 'Dashboard';

    return pathParts
      .map((part) =>
        part
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase())
      )
      .join(' / ');
  };

  const currentPage = generateBreadcrumb();

  return (
    <header className="flex justify-between items-end px-8 py-4 bg-white shadow-md border-b sticky top-0 z-20">
      {/* Breadcrumb as Title */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">Pages</span>
        <h1 className="text-xl font-semibold text-blue-800">{currentPage}</h1>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }}
        className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
