import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Events from './pages/Events'
import ItemDetail from './pages/ItemDetail'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/catalogue"   element={<Catalogue />} />
          <Route path="/events"      element={<Events />} />
          <Route path="/item/:id"    element={<ItemDetail />} />
          <Route path="/booking"     element={<Booking />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin"       element={<Admin />} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
