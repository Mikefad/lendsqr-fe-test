import { NavLink } from 'react-router-dom'
import Icon, { IconName } from './Icon'

interface SidebarLink {
  icon: IconName
  label: string
  to?: string
}

const customerLinks: SidebarLink[] = [
  { icon: 'usersGroup', label: 'Users', to: '/users' },
  { icon: 'users', label: 'Guarantors' },
  { icon: 'loan', label: 'Loans' },
  { icon: 'handshake', label: 'Decision Models' },
  { icon: 'piggyBank', label: 'Savings' },
  { icon: 'handHolding', label: 'Loan Requests' },
  { icon: 'userCheck', label: 'Whitelist' },
  { icon: 'userTimes', label: 'Karma' },
]

const businessLinks: SidebarLink[] = [
  { icon: 'briefcase', label: 'Organization' },
  { icon: 'handHolding', label: 'Loan Products' },
  { icon: 'bank', label: 'Savings Products' },
  { icon: 'coins', label: 'Fees and Charges' },
  { icon: 'scroll', label: 'Transactions' },
  { icon: 'briefcase', label: 'Services' },
  { icon: 'userCog', label: 'Service Account' },
  { icon: 'scroll', label: 'Settlements' },
  { icon: 'chartBar', label: 'Reports' },
]

const settingsLinks: SidebarLink[] = [
  { icon: 'settings', label: 'Preferences' },
  { icon: 'coins', label: 'Fees and Pricing' },
  { icon: 'clipboardList', label: 'Audit Logs' },
]

function SidebarGroup({ title, links, onNavigate }: { title: string; links: SidebarLink[]; onNavigate: () => void }) {
  return (
    <section className="sidebar-group">
      <h2>{title}</h2>
      <ul>
        {links.map(({ icon, label, to }) => (
          <li key={label}>
            {to ? (
              <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''} onClick={onNavigate}>
                <Icon name={icon} className="sidebar-link__icon" /><span>{label}</span>
              </NavLink>
            ) : (
              <a href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}>
                <Icon name={icon} className="sidebar-link__icon" /><span>{label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <button className={`sidebar-overlay ${open ? 'visible' : ''}`} type="button" aria-label="Close navigation" onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <button className="organization-switcher" type="button"><Icon name="briefcase" /> Switch Organization <Icon name="chevronDown" className="organization-switcher__chevron" /></button>
        <NavLink className="dashboard-link" to="/dashboard" onClick={onClose}><Icon name="dashboard" /> Dashboard</NavLink>
        <SidebarGroup title="Customers" links={customerLinks} onNavigate={onClose} />
        <SidebarGroup title="Businesses" links={businessLinks} onNavigate={onClose} />
        <SidebarGroup title="Settings" links={settingsLinks} onNavigate={onClose} />
      </aside>
    </>
  )
}
