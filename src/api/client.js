// src/api/client.js — thin wrapper around fetch for our REST API.
//
// In dev, Vite proxies /api → http://localhost:4000 (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend origin.

const BASE = import.meta.env.VITE_API_URL || ''

function authHeaders() {
  const token = localStorage.getItem('uh-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(auth ? authHeaders() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.details = data.details
    throw err
  }
  return data
}

export const api = {
  // items
  listItems: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/items${qs ? `?${qs}` : ''}`)
  },
  getItem: (id) => request(`/items/${id}`),
  createItem: (body) => request('/items', { method: 'POST', body, auth: true }),
  updateItem: (id, body) => request(`/items/${id}`, { method: 'PUT', body, auth: true }),
  deleteItem: (id) => request(`/items/${id}`, { method: 'DELETE', auth: true }),

  // bookings
  createBooking: (body) => request('/bookings', { method: 'POST', body }),
  listBookings: () => request('/bookings', { auth: true }),

  // auth
  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  me: () => request('/auth/me', { auth: true }),

  health: () => request('/health'),
}
