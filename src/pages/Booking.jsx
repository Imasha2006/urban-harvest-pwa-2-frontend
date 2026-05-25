import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useApp } from '../context/AppContext'
import Spinner from '../components/Spinner'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Booking() {
  const { t } = useApp()
  const [params] = useSearchParams()
  const preselectedId = params.get('item')

  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [form, setForm] = useState({ guest_name: '', guest_email: '', qty: 1, item_id: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    let active = true
    api.listItems()
      .then((data) => {
        if (!active) return
        setItems(data)
        setForm((f) => ({ ...f, item_id: preselectedId ?? data[0]?.id ?? '' }))
      })
      .catch((e) => { if (active) setServerError(e.message) })
      .finally(() => { if (active) setLoadingItems(false) })
    return () => { active = false }
  }, [preselectedId])

  function validate(state) {
    const e = {}
    if (!state.guest_name.trim()) e.guest_name = t.booking.errors.nameRequired
    if (!state.guest_email.trim()) e.guest_email = t.booking.errors.emailRequired
    else if (!EMAIL_RE.test(state.guest_email)) e.guest_email = t.booking.errors.emailInvalid
    if (Number(state.qty) < 1) e.qty = t.booking.errors.qtyMin
    return e
  }

  function handleChange(field, value) {
    const next = { ...form, [field]: value }
    setForm(next)
    if (Object.keys(errors).length) setErrors(validate(next))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError(null)
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    try {
      await api.createBooking({
        item_id: form.item_id,
        qty: Number(form.qty),
        guest_name: form.guest_name,
        guest_email: form.guest_email,
        notes: form.notes || null,
      })
      setSuccess(true)
      setForm({ guest_name: '', guest_email: '', qty: 1, item_id: items[0]?.id ?? '', notes: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setServerError(err.details?.join(', ') || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingItems) return <section className="section-container"><Spinner label={t.common.loading} /></section>

  return (
    <section className="section-container">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-3">{t.booking.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t.booking.sub}</p>
        </header>

        {success && (
          <div role="status" aria-live="polite"
            className="card !bg-harvest-50 dark:!bg-harvest-900/20 border-harvest-300 dark:border-harvest-700 mb-6 flex gap-3">
            <span className="text-2xl" aria-hidden="true">✅</span>
            <p className="font-semibold text-harvest-800 dark:text-harvest-200">{t.booking.success}</p>
          </div>
        )}

        {serverError && (
          <div role="alert" className="card !bg-red-50 dark:!bg-red-900/20 border-red-300 mb-6 text-red-700 dark:text-red-300">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="card space-y-5">
          <div>
            <label htmlFor="item_id" className="block text-sm font-semibold mb-2">
              {t.booking.item} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <select id="item_id" value={form.item_id} onChange={(e) => handleChange('item_id', e.target.value)} className="input-field">
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} {i.price > 0 ? `— $${i.price}${i.unit}` : '— Free'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="guest_name" className="block text-sm font-semibold mb-2">
              {t.booking.name} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input id="guest_name" type="text" value={form.guest_name}
              onChange={(e) => handleChange('guest_name', e.target.value)}
              aria-invalid={!!errors.guest_name} aria-describedby={errors.guest_name ? 'name-error' : undefined}
              className="input-field" required />
            {errors.guest_name && <p id="name-error" role="alert" className="text-red-600 text-sm mt-1">{errors.guest_name}</p>}
          </div>

          <div>
            <label htmlFor="guest_email" className="block text-sm font-semibold mb-2">
              {t.booking.email} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input id="guest_email" type="email" autoComplete="email" value={form.guest_email}
              onChange={(e) => handleChange('guest_email', e.target.value)}
              aria-invalid={!!errors.guest_email} aria-describedby={errors.guest_email ? 'email-error' : undefined}
              className="input-field" required />
            {errors.guest_email && <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">{errors.guest_email}</p>}
          </div>

          <div>
            <label htmlFor="qty" className="block text-sm font-semibold mb-2">
              {t.booking.qty} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input id="qty" type="number" min="1" max="10" value={form.qty}
              onChange={(e) => handleChange('qty', e.target.value)}
              aria-invalid={!!errors.qty} className="input-field" required />
            {errors.qty && <p role="alert" className="text-red-600 text-sm mt-1">{errors.qty}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold mb-2">{t.booking.notes}</label>
            <textarea id="notes" rows="3" value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)} className="input-field resize-y" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? t.common.loading : t.booking.submit}
          </button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            By submitting, you agree to our <Link to="/" className="underline hover:text-harvest-600">terms</Link>.
          </p>
        </form>
      </div>
    </section>
  )
}
