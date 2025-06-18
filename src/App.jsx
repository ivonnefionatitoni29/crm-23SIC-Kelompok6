import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { BrowserRouter } from 'react-router-dom';

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

// ✅ Tambahkan import untuk form user
import FormPenitipan from './pages/FormPenitipan';
import FormKebiri from './pages/FormKebiri';
import FormVaksinasi from './pages/FormVaksinasi';

import PrediksiPenyakitHewan from './pages/PrediksiPenyakitHewan';
import FaqPage from './pages/FaqPage';

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/homeuser" element={<HomeUser />} />
      <Route path="/homeuserlogin" element={<HomeUserLogin />} />
      <Route path="/pelangganjb" element={<PelangganJB />} />
      <Route path="/prediksi-kesehatan" element={<PrediksiPenyakitHewan />} />
      <Route path="/loyalty" element={<LoyaltyPage />} /> {/* New Route */}



      {/* ✅ Rute form layanan untuk user */}
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
      </Route>

       <Route path="/faq-page" element={<FaqPage />} />
    </Routes>
  );
}

export default App;
