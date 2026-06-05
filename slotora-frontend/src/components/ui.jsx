export function Icon({ name, size = 16, color = 'currentColor' }) {
  const paths = {
    arrow:     <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowLeft: <path d="M19 12H5M11 18l-6-6 6-6" />,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>,
    clock:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/></>,
    star:     <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.8 1.1-6L3.4 9.4l6-.8L12 3Z"/>,
    x:        <path d="M6 6l12 12M18 6L6 18"/>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  )
}

const PALETTE = ['#E87E5B', '#6BAF92', '#E0913B', '#C77E66', '#9B7FDB', '#5B9BE8']

export function hashColor(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return PALETTE[Math.abs(h) % PALETTE.length]
}

export function Monogram({ name = '?', color, size = 38, pill = false }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div style={{
      width: size, height: size, borderRadius: pill ? 999 : 12,
      background: color || hashColor(name), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, letterSpacing: '-0.02em',
      flexShrink: 0, fontFamily: "'Hanken Grotesk', sans-serif",
    }}>
      {initials}
    </div>
  )
}

export function StatusBadge({ status }) {
  const cfg = {
    PENDING:   { bg: '#FCE7CF', text: '#B16A1E', dot: '#F9A869', label: 'Pending' },
    CONFIRMED: { bg: '#DDEDE3', text: '#3F7A5F', dot: '#6BAF92', label: 'Confirmed' },
    CANCELLED: { bg: '#F7DCD2', text: '#B23C28', dot: '#D9603C', label: 'Cancelled' },
  }
  const s = cfg[status] || cfg.PENDING
  return (
    <span style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
      <span style={{ background: s.dot, width: 7, height: 7, borderRadius: 999, flexShrink: 0, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}
