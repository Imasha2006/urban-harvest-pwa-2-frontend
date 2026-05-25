import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme, toggleLang, t, online, canInstall, promptInstall } = useApp()
  const { user, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/',          label: t.nav.home },
    { to: '/catalogue', label: t.nav.catalogue },
    { to: '/events',    label: t.nav.events },
    { to: '/booking',   label: t.nav.booking },
  ]
  if (isAdmin) links.push({ to: '/admin', label: 'Admin' })

  return (
    <header className="bg-harvest-600 dark:bg-harvest-700 text-white shadow-lg sticky top-0 z-40">
      {!online && (
        <div className="bg-earth-600 text-white text-center text-sm py-1">
          ⚠️ You're offline — showing saved content
        </div>
      )}
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3"
      >
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg sm:text-xl">
          <span aria-hidden="true" className="text-2xl sm:text-3xl">🌱</span>
          <span className="hidden sm:inline">Urban Harvest Hub</span>
          <span className="sm:hidden">UHH</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {canInstall && (
            <button onClick={promptInstall}
              className="hidden sm:inline-flex bg-white text-harvest-700 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-harvest-50">
              ⬇️ Install
            </button>
          )}
          <button onClick={toggleLang} aria-label="Switch language"
            className="bg-white text-harvest-700 px-3 py-2 rounded-lg font-semibold text-sm hover:bg-harvest-50">
            {t.common.switchLang}
          </button>
          <button onClick={toggleTheme} aria-label={t.common.toggleTheme} aria-pressed={theme === 'dark'}
            className="bg-white text-harvest-700 px-3 py-2 rounded-lg font-semibold hover:bg-harvest-50">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu"
            aria-expanded={open} aria-controls="mobile-menu"
            className="md:hidden bg-white text-harvest-700 px-3 py-2 rounded-lg font-bold">
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="md:hidden bg-harvest-700 dark:bg-harvest-800 px-4 pb-4 space-y-1 animate-slide-up">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded font-medium ${isActive ? 'bg-harvest-900 underline' : 'hover:bg-harvest-800'}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            {user ? (
              <button onClick={() => { logout(); setOpen(false) }}
                className="block w-full text-left px-3 py-3 rounded font-medium hover:bg-harvest-800">
                Log out ({user.name})
              </button>
            ) : (
              <NavLink to="/login" onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded font-medium hover:bg-harvest-800">
                Admin login
              </NavLink>
            )}
          </li>
        </ul>
      )}
    </header>
  )
}
