import { useState } from 'react'

/**
 * Requests Notification permission and shows a sample notification.
 * Demonstrates the push-notification capability required by the spec.
 * (A full push setup needs a backend push service + VAPID keys; this
 *  shows the client-side permission flow and a local notification.)
 */
export default function NotificationButton() {
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [status, setStatus] = useState(supported ? Notification.permission : 'unsupported')

  async function enable() {
    if (!supported) return
    const perm = await Notification.requestPermission()
    setStatus(perm)
    if (perm === 'granted') {
      // show a sample via the service worker if available, else directly
      const reg = await navigator.serviceWorker?.getRegistration()
      const opts = { body: 'You will now receive updates on new events and products.', icon: '/icon-192.png' }
      if (reg) reg.showNotification('🌱 Notifications enabled!', opts)
      else new Notification('🌱 Notifications enabled!', opts)
    }
  }

  if (!supported) {
    return <p className="text-sm text-gray-500">Notifications aren’t supported in this browser.</p>
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={enable} disabled={status === 'granted'} className="btn-outline !py-2 text-sm">
        {status === 'granted' ? '✅ Notifications on' : '🔔 Enable notifications'}
      </button>
      {status === 'denied' && (
        <span className="text-sm text-red-600">Blocked — enable in browser settings.</span>
      )}
    </div>
  )
}
