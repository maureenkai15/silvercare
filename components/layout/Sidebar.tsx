'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { section: 'Monitor', items: [
    { href: '/dashboard', icon: '▦', label: 'Dashboard' },
    { href: '/caregiver', icon: '⊛', label: 'Caregivers' },
  ]},
  { section: 'Tools', items: [
    { href: '/predictor', icon: '◎', label: 'Risk Predictor' },
    { href: '/companion', icon: '◌', label: 'AI Companion' },
  ]},
  { section: 'Insights', items: [
    { href: '/reports', icon: '▤', label: 'Reports' },
    { href: '/settings', icon: '◈', label: 'Settings' },
  ]},
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-dot">🤍</div>
        <div className="brand-text">
          <div className="brand-name">SilverCare</div>
          <div className="brand-sub">Singapore</div>
        </div>
      </div>
      {nav.map(group => (
        <div key={group.section}>
          <div className="nav-section-label">{group.section}</div>
          {group.items.map(item => (
            <Link key={item.href} href={item.href}
              className={`nav-link ${path === item.href ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
      <div className="sidebar-user">
        <div className="user-avatar">CG</div>
        <div>
          <div className="user-name">Chan Gek Lian</div>
          <div className="user-role">Lead Caregiver</div>
        </div>
      </div>
    </aside>
  )
}
