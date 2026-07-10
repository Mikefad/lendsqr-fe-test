import { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

interface TopNavProps {
  onMenuClick: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export default function TopNav({ onMenuClick, searchValue = '', onSearchChange }: TopNavProps) {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const preventSubmit = (event: FormEvent) => event.preventDefault()
  const displayName = session?.displayName || 'Adedeji'

  return (
    <header className="top-nav">
      <button className="top-nav__menu" type="button" aria-label="Open navigation" onClick={onMenuClick}>
        <Icon name="menu" />
      </button>
      <img className="top-nav__logo" src={logo} alt="Lendsqr" />

      <form className="search-box" role="search" onSubmit={preventSubmit}>
        <label className="sr-only" htmlFor="global-user-search">Search users</label>
        <input
          id="global-user-search"
          type="search"
          value={searchValue}
          placeholder="Search for anything"
          disabled={!onSearchChange}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
        <button type="submit" aria-label="Submit search"><Icon name="search" /></button>
      </form>

      <nav className="top-nav__actions" aria-label="Account navigation">
        <a href="#docs">Docs</a>
        <button className="notification" type="button" aria-label="Notifications"><Icon name="bell" /></button>

        <div className="profile-menu" ref={profileMenuRef}>
          <button
            className="profile-menu__trigger"
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className="avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
            <span className="profile-menu__name">{displayName}</span>
            <Icon name="chevronDown" className={`profile-menu__chevron ${profileOpen ? 'open' : ''}`} />
          </button>

          {profileOpen && (
            <div className="profile-menu__dropdown" role="menu">
              <div className="profile-menu__account">
                <strong>{displayName}</strong>
                <span>{session?.email}</span>
              </div>
              <button type="button" role="menuitem" onClick={handleLogout}>
                <Icon name="logout" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
