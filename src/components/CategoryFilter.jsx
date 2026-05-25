export default function CategoryFilter({ categories, active, onChange, allLabel = 'All' }) {
  const base = 'px-5 py-2 rounded-full font-semibold transition-colors text-sm'
  const on = 'bg-harvest-600 text-white shadow-md'
  const off = 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
  return (
    <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2 justify-center mb-8">
      <button role="tab" aria-selected={active === 'all'} onClick={() => onChange('all')}
        className={`${base} ${active === 'all' ? on : off}`}>{allLabel}</button>
      {categories.map((c) => (
        <button key={c.id} role="tab" aria-selected={active === c.id} onClick={() => onChange(c.id)}
          className={`${base} ${active === c.id ? on : off}`}>
          <span className="mr-1" aria-hidden="true">{c.icon}</span>{c.name}
        </button>
      ))}
    </div>
  )
}
