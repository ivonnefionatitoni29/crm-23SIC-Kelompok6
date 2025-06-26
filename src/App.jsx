import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
// import { BrowserRouter } from 'react-router-dom'; // Tidak perlu import ini di sini jika sudah di index.js

import Dashboard from './pages/Dashboard';
import Penitipan from './pages/Penitipan';
import Vaksinasi from './pages/Vaksinasi';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './pages/RequireAuth';
import FAQ from './pages/FAQ';
import Loyalitaspelanggan from './pages/Loyalitaspelanggan';
import Kebiri from './pages/Kebiri';
import Beli from './pages/Beli';
import HomeUser from './pages/Homeuser';
import HomeUserLogin from './pages/HomeUserLogin';
import PelangganJB from './pages/PelangganJB';
import LoyaltyPage from './pages/LoyaltyPage';
import RegisterPage from './pages/RegisterPage';

import FormPenitipan from './pages/FormPenitipan';
import FormKebiri from './pages/FormKebiri';
import FormVaksinasi from './pages/FormVaksinasi';

import PrediksiPenyakitHewan from './pages/PrediksiPenyakitHewan';
import FaqPage from './pages/FaqPage';

import UserTable from './pages/UserTable'; // PASTIKAN PATH INI SESUAI
import AdminProductCRUD from './pages/AdminProductCRUD'; // PASTIKAN PATH INI SESUAI
import ManajemenStok from './pages/ManajemenStok'; // ⭐ IMPORT KOMPONEN MANAJEMEN STOK

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/RegisterPage" element={<RegisterPage />} />
      <Route path="/homeuser" element={<HomeUser />} />
      <Route path="/homeuserlogin" element={<HomeUserLogin />} />
      <Route path="/pelangganjb" element={<PelangganJB />} />
      
      <Route path="/loyalty" element={<LoyaltyPage />} /> {/* New Route */}
      <Route path="/faq-page" element={<FaqPage />} />
      {/* Rute untuk Admin Product CRUD */}
      

      {/* Rute form layanan untuk user */}
      <Route path="/form-penitipan" element={<FormPenitipan />} />
      <Route path="/form-kebiri" element={<FormKebiri />} />
      <Route path="/form-vaksinasi" element={<FormVaksinasi />} />

      {/* Halaman admin dengan layout dan autentikasi */}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/penitipan" element={<Penitipan />} />
        <Route path="/vaksinasi" element={<Vaksinasi />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/loyalitaspelanggan" element={<Loyalitaspelanggan />} />
        <Route path="/kebiri" element={<Kebiri />} />
        <Route path="/jualbeli" element={<Beli />} />
        <Route path="/admin-products" element={<AdminProductCRUD />} />
        <Route path="/prediksi-kesehatan" element={<PrediksiPenyakitHewan />} />
        {/* Rute untuk Tabel User */}
        <Route path="/users" element={<UserTable />} />
        {/* ⭐ Rute baru untuk Manajemen Stok ⭐ */}
        <Route path="/admin/stock-management" element={<ManajemenStok />} />
      </Route>

    </Routes>
  );
}

export default App;