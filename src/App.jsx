import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';

import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/Produk';
import Penitipan from './pages/Penitipan';
import Vaksinasi from './pages/Vaksinasi';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from "./pages/RequireAuth";

function App() {
  return (
    <Routes>
      {/* Halaman depan & login di luar layout utama */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Halaman yang memakai layout utama */}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/penitipan" element={<Penitipan />} />
        <Route path="/vaksinasi" element={<Vaksinasi />} />
      </Route>
    </Routes>
  );
}

export default App;
