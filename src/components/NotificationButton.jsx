import { useState, useEffect } from 'react'

export default function NotificationButton() {
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [status, setStatus] = useState(supported ? Notification.permission : 'unsupported')
  const [swReg, setSwReg] = useState(null)

  // Get service worker registration on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) setSwReg(reg)
      })
    }
  }, [])

  async function enable() {
    if (!supported) return

    const perm = await Notification.requestPermission()
    setStatus(perm)

    if (perm === 'granted') {
      if (swReg) {
        // Show via service worker (proper PWA way)
        await swReg.showNotification('🌱 Urban Harvest Hub', {
          body: 'Thanks for subscribing! You will get updates on new events, workshops and products.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: 'welcome',
          actions: [
            { action: 'view', title: 'View Events' },
            { action: 'close', title: 'Dismiss' }
          ]
        })
      } else {
        // Fallback if SW not ready
        new Notification('🌱 Urban Harvest Hub', {
          body: 'Thanks for subscribing! You will get updates on new events and products.',
          icon: '/icon-192.png',
        })
      }
    }
  }

  async function sendTestNotification() {
    if (status !== 'granted') return
    if (swReg) {
      await swReg.showNotification('🥬 New Workshop Available!', {
        body: 'Home Composting 101 — this Saturday at Colombo Community Garden. Only 12 spots left!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'workshop-update',
        actions: [
          { action: 'book', title: 'Book Now' },
          { action: 'close', title: 'Later' }
        ]
      })
    } else {
      new Notification('🥬 New Workshop Available!', {
        body: 'Home Composting 101 — this Saturday at Colombo Community Garden!',
        icon: '/icon-192.png',
      })
    }
  }

  if (!supported) {
    return (
      <p className="text-sm text-gray-500">
        Notifications are not supported in this browser.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Enable button */}
      <button
        onClick={enable}
        disabled={status === 'granted'}
        className="btn-primary"
      >
        {status === 'granted' ? '✅ Notifications Enabled' : '🔔 Enable Notifications'}
      </button>

      {/* Test notification button - only shows after enabled */}
      {status === 'granted' && (
        <button
          onClick={sendTestNotification}
          className="btn-outline"
        >
          🧪 Send Test Notification
        </button>
      )}

      {status === 'denied' && (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">
            Notifications blocked. Please enable in browser settings.
          </p>
          <p className="text-xs text-gray-500">
            Click the 🔒 lock icon in the address bar → Notifications → Allow
          </p>
        </div>
      )}
    </div>
  )
}