import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section-container text-center">
      <div className="text-7xl mb-4" aria-hidden="true">🌿</div>
      <h1 className="text-5xl sm:text-6xl font-bold font-heading text-harvest-600 dark:text-harvest-400 mb-3">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Page not found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        This page composted itself. Let's get you back to fresh ground.
      </p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </section>
  )
}
