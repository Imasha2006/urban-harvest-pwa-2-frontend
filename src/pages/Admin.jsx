import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

const EMPTY = {
  id: '', category: 'food', name: '', short_desc: '', description: '',
  price: 0, unit: '/one-time', image: '', stock: 0, tags: '',
}

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  function load() {
    setLoading(true)
    api.listItems().then(setItems).finally(() => setLoading(false))
  }
  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  // Redirect non-admins
  if (authLoading) return <section className="section-container"><Spinner /></section>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  async function handleCreate(e) {
    e.preventDefault()
    setMsg(null); setErr(null)
    try {
      await api.createItem({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      })
      setMsg(`Created "${form.name}"`)
      setForm(EMPTY)
      load()
    } catch (e2) {
      setErr(e2.details?.join(', ') || e2.message)
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    setMsg(null); setErr(null)
    try {
      await api.deleteItem(id)
      setMsg(`Deleted "${name}"`)
      load()
    } catch (e2) {
      setErr(e2.message)
    }
  }

  return (
    <section className="section-container">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Signed in as {user.name} ({user.role})</p>
      </header>

      {msg && <div role="status" className="card !bg-harvest-50 dark:!bg-harvest-900/20 border-harvest-300 mb-4 text-harvest-800 dark:text-harvest-200">{msg}</div>}
      {err && <div role="alert" className="card !bg-red-50 dark:!bg-red-900/20 border-red-300 mb-4 text-red-700 dark:text-red-300">{err}</div>}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create form */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Add new item</h2>
          <form onSubmit={handleCreate} className="card space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="id" className="block text-xs font-semibold mb-1">ID *</label>
                <input id="id" className="input-field" value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="category" className="block text-xs font-semibold mb-1">Category *</label>
                <select id="category" className="input-field" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="food">food</option>
                  <option value="lifestyle">lifestyle</option>
                  <option value="education">education</option>
                  <option value="events">events</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold mb-1">Name *</label>
              <input id="name" className="input-field" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="short_desc" className="block text-xs font-semibold mb-1">Short description *</label>
              <input id="short_desc" className="input-field" value={form.short_desc}
                onChange={(e) => setForm({ ...form, short_desc: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-semibold mb-1">Description *</label>
              <textarea id="description" rows="2" className="input-field" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="image" className="block text-xs font-semibold mb-1">Image URL *</label>
              <input id="image" className="input-field" value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="price" className="block text-xs font-semibold mb-1">Price</label>
                <input id="price" type="number" min="0" className="input-field" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label htmlFor="stock" className="block text-xs font-semibold mb-1">Stock</label>
                <input id="stock" type="number" min="0" className="input-field" value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div>
                <label htmlFor="unit" className="block text-xs font-semibold mb-1">Unit</label>
                <input id="unit" className="input-field" value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="block text-xs font-semibold mb-1">Tags (comma-separated)</label>
              <input id="tags" className="input-field" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Organic, Local" />
            </div>
            <button type="submit" className="btn-primary w-full">Create item</button>
          </form>
        </div>

        {/* Existing items list */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Existing items ({items.length})</h2>
          {loading ? <Spinner /> : (
            <ul className="space-y-2">
              {items.map((i) => (
                <li key={i.id} className="card !p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={i.image} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{i.name}</p>
                      <p className="text-xs text-gray-500">{i.category} · stock {i.stock}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(i.id, i.name)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold flex-shrink-0">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
