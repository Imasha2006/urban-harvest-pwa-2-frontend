import { useEffect, useState } from 'react'

/**
 * useWeather — fetch current weather for given coordinates from
 * Open-Meteo's free public API. No API key required.
 *
 * Defaults to Colombo, Sri Lanka (matches our event locations).
 *
 * Returns { data, loading, error } where `data` shape is:
 *   { temperature, windSpeed, weatherCode, time }
 */
const WEATHER_DESCRIPTIONS = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Heavy showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Storm w/ hail', 99: 'Severe storm w/ hail',
}

const WEATHER_ICONS = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌦️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

export function useWeather(lat = 6.9271, lon = 79.8612) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function fetchWeather() {
      try {
        setState({ data: null, loading: true, error: null })
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weather_code,wind_speed_10m` +
          `&timezone=auto`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        const c = json.current ?? {}
        setState({
          loading: false,
          error: null,
          data: {
            temperature: c.temperature_2m,
            windSpeed:   c.wind_speed_10m,
            weatherCode: c.weather_code,
            time:        c.time,
            description: WEATHER_DESCRIPTIONS[c.weather_code] ?? 'Unknown',
            icon:        WEATHER_ICONS[c.weather_code] ?? '🌍',
          },
        })
      } catch (err) {
        if (err.name === 'AbortError' || cancelled) return
        setState({ data: null, loading: false, error: err.message })
      }
    }
    fetchWeather()
    return () => { cancelled = true; controller.abort() }
  }, [lat, lon])

  return state
}
