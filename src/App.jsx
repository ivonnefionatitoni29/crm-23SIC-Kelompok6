import Dashboard from './pages/Dashboard'
import {Routes, Route} from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProductManagement from './pages/Produk'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path ="/" element={<Dashboard />} />
      <Route path ="/produk" element={<ProductManagement />} />
      </Route>
    </Routes>
  )
}

export default App
