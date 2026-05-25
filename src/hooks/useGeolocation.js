import { useState, useCallback } from 'react'

/**
 * useGeolocation — wraps the browser Geolocation API.
 * Returns { coords, loading, error, request } where request() triggers
 * the permission prompt (must be called from a user gesture).
 */
export function useGeolocation() {
  const [state, setState] = useState({ coords: null, loading: false, error: null })

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ coords: null, loading: false, error: 'Geolocation not supported' })
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          error: null,
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        })
      },
      (err) => setState({ coords: null, loading: false, error: err.message }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  return { ...state, request }
}
