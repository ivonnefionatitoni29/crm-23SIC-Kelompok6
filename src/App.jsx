import Dashboard from './pages/Dashboard'
import {Routes, Route} from 'react-router-dom'
import MainLayout from './components/MainLayout'
import CustomerManagement from './pages/CustomerManagement'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
      <Route path ="/" element={<Dashboard />} />
      <Route path ="/CustomerManagement" element={<CustomerManagement />} />
      </Route>
    </Routes>
  )
}

export default App
