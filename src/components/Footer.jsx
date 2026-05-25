import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { t } = useApp()
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold font-heading mb-3 flex items-center gap-2">
            <span aria-hidden="true">🌱</span> Urban Harvest Hub
          </h3>
          <p className="text-sm">{t.footer.tagline}</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogue" className="hover:text-white">{t.nav.catalogue}</Link></li>
            <li><Link to="/events" className="hover:text-white">{t.nav.events}</Link></li>
            <li><Link to="/booking" className="hover:text-white">{t.nav.booking}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">About</h4>
          <p className="text-sm">A full-stack PWA built for COMP50017 — React, Express &amp; SQLite.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-8 pt-6 text-sm text-center">
        {t.footer.rights}
      </div>
    </footer>
  )
}
