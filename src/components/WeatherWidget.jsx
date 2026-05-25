import { useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useGeolocation } from '../hooks/useGeolocation'
import { useApp } from '../context/AppContext'

export default function WeatherWidget() {
  const { t } = useApp()
  const geo = useGeolocation()
  // default Colombo; switch to user's coords once geolocation resolves
  const [coords, setCoords] = useState({ lat: 6.9271, lon: 79.8612, name: 'Colombo' })
  const { data, loading, error } = useWeather(coords.lat, coords.lon)

  function useMyLocation() {
    geo.request()
  }
  // when geolocation resolves, update coords
  if (geo.coords && geo.coords.lat !== coords.lat && geo.coords.lon !== coords.lon) {
    setCoords({ lat: geo.coords.lat, lon: geo.coords.lon, name: 'Your location' })
  }

  return (
    <div role="region" aria-label={t.home.weatherTitle}
      className="card glass max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <div className="text-5xl" aria-hidden="true">
          {loading ? '⏳' : error ? '⚠️' : data?.icon}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t.home.weatherTitle}</p>
          {loading && <p className="font-semibold">{t.common.loading}</p>}
          {error && <p className="text-sm text-red-600">{t.home.weatherFallback}</p>}
          {data && (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(data.temperature)}°C
                <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">{data.description}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                📍 {coords.name} · Wind {Math.round(data.windSpeed)} km/h
              </p>
            </>
          )}
        </div>
      </div>
      <button onClick={useMyLocation} disabled={geo.loading}
        className="btn-outline !py-1.5 !px-3 text-xs mt-3 w-full">
        {geo.loading ? 'Locating…' : '📍 Use my location'}
      </button>
      {geo.error && <p className="text-xs text-red-600 mt-1">{geo.error}</p>}
    </div>
  )
}
