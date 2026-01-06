import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home.'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { AuthGuard } from './components/Auth/AuthGuard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/*" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
