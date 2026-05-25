import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { useApp } from '../context/AppContext'
import ItemCard from '../components/ItemCard'
import Spinner from '../components/Spinner'
import WeatherWidget from '../components/WeatherWidget'

export default function Events() {
  const { t } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([api.listItems({ category: 'events' }), api.listItems({ category: 'education' })])
      .then(([events, workshops]) => { if (active) setItems([...events, ...workshops]) })
      .catch((e) => { if (active) setError(e.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <section className="section-container">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">{t.nav.events} &amp; {t.nav.workshops}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Markets, planting days, and hands-on workshops. Most events are free and family-friendly.
        </p>
        <WeatherWidget />
      </header>

      {loading ? <Spinner label={t.common.loading} />
        : error ? <p className="text-center text-red-600">{t.common.error}</p>
        : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((e) => <ItemCard key={e.id} item={e} />)}
          </div>
        )}
    </section>
  )
}
