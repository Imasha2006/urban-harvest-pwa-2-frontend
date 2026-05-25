import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useApp } from '../context/AppContext'
import ItemCard from '../components/ItemCard'
import Spinner from '../components/Spinner'
import WeatherWidget from '../components/WeatherWidget'
import NotificationButton from '../components/NotificationButton'

const CATEGORIES = [
  { id: 'food',      name: 'Food',      icon: '🥬' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌿' },
  { id: 'education', name: 'Workshops', icon: '📚' },
  { id: 'events',    name: 'Events',    icon: '🎪' },
]

export default function Home() {
  const { t, canInstall, promptInstall } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCat, setActiveCat] = useState('food')

  useEffect(() => {
    let active = true
    api.listItems()
      .then((data) => { if (active) setItems(data) })
      .catch((e) => { if (active) setError(e.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(
    () => items.filter((i) => i.category === activeCat).slice(0, 3),
    [items, activeCat],
  )

  return (
    <>
      <section className="bg-gradient-to-br from-harvest-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="section-container text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading mb-6 text-gray-900 dark:text-white">
            {t.home.heroLine1} <span className="text-gradient-green">{t.home.heroLine2}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.home.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/catalogue" className="btn-primary">{t.home.ctaBrowse}</Link>
            <Link to="/booking" className="btn-outline">{t.home.ctaSubscribe}</Link>
          </div>
          {canInstall && (
            <button onClick={promptInstall} className="btn-secondary mb-8">
              ⬇️ Install this app on your device
            </button>
          )}
          <WeatherWidget />
        </div>
      </section>

      <section className="section-container">
        <header className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3">{t.home.featuredTitle}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t.home.featuredSub}</p>
        </header>

        {/* Category master selector */}
        <div role="tablist" aria-label="Categories" className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((c) => (
            <button key={c.id} role="tab" aria-selected={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
                activeCat === c.id
                  ? 'bg-harvest-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
              }`}>
              <span className="mr-1" aria-hidden="true">{c.icon}</span>{c.name}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {loading ? <Spinner label={t.common.loading} />
          : error ? <p className="text-center text-red-600">{t.common.error}</p>
          : (
            <div aria-live="polite" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((i) => <ItemCard key={i.id} item={i} />)}
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-8">{t.catalogue.noResults}</p>
              )}
            </div>
          )}

        <div className="text-center mt-10">
          <Link to="/catalogue" className="btn-secondary">See full catalogue →</Link>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/50">
        <div className="section-container text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-4">Stay in the loop</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get notified about new workshops, events, and seasonal products.
          </p>
          <div className="flex justify-center">
            <NotificationButton />
          </div>
        </div>
      </section>
    </>
  )
}
