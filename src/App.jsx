import Dashboard from './pages/Dashboard'
import {Routes, Route} from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProductManagement from './pages/Produk'
import FAQ from './pages/FAQ'
import Loyalitaspelanggan from './pages/Loyalitaspelanggan'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path ="/" element={<Dashboard />} />
      <Route path ="/faq" element={<FAQ />} />
      <Route path ="/produk" element={<ProductManagement />} />
      <Route path ="/loyalitaspelanggan" element={<Loyalitaspelanggan/>} />
      </Route>
    </Routes>
  )
}

export default App
