import { useState, useEffect, useMemo } from 'react'
import { api } from '../api/client'
import { useApp } from '../context/AppContext'
import CategoryFilter from '../components/CategoryFilter'
import ItemCard from '../components/ItemCard'
import Spinner from '../components/Spinner'

const PRODUCT_CATS = [
  { id: 'food',      name: 'Food',      icon: '🥬' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌿' },
]

export default function Catalogue() {
  const { t } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  // Fetch products only (food + lifestyle). We pull all and filter client-side
  // so the search box can also work offline against cached data.
  useEffect(() => {
    let active = true
    setLoading(true)
    api.listItems()
      .then((data) => { if (active) setItems(data.filter((i) => i.category === 'food' || i.category === 'lifestyle')) })
      .catch((e) => { if (active) setError(e.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((p) => filter === 'all' || p.category === filter)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.short_desc.toLowerCase().includes(q))
  }, [items, filter, query])

  return (
    <section className="section-container">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-4">{t.catalogue.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{t.catalogue.sub}</p>
      </header>

      <div className="max-w-md mx-auto mb-6">
        <label htmlFor="search" className="sr-only">Search products</label>
        <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…" className="input-field" />
      </div>

      <CategoryFilter categories={PRODUCT_CATS} active={filter} onChange={setFilter} allLabel={t.catalogue.filterAll} />

      {loading ? <Spinner label={t.common.loading} />
        : error ? <p className="text-center text-red-600">{t.common.error}</p>
        : (
          <>
            <div aria-live="polite" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ItemCard key={p.id} item={p} />)}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-12">{t.catalogue.noResults}</p>
            )}
          </>
        )}
    </section>
  )
}
