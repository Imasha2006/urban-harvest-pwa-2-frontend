export default function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-harvest-200 border-t-harvest-600 rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
    </div>
  )
}
