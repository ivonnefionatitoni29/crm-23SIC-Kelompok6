import Dashboard from './pages/Dashboard'
import SalesManagement from './pages/SalesManagement'
import {Routes, Route} from 'react-router-dom'
import MainLayout from './components/MainLayout'
import CustomerManagement from './pages/CustomerManagement'
import ProductManagement from './pages/Produk'
import Kebiri from './pages/Kebiri'
import Beli from './pages/Beli'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path ="/" element={<Dashboard />} />
      <Route path ="/CustomerManagement" element={<CustomerManagement />} />
      <Route path ="/produk" element={<ProductManagement />} />
      <Route path ="/penjualan" element={<SalesManagement/>} />
      <Route path ="/kebiri" element={<Kebiri/>} />
      <Route path ="/jualbeli" element={<Beli/>} />
      
      </Route>
    </Routes>
  )
}

export default App
