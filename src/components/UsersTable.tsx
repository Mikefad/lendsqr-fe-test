import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSelectedUser } from '../services/userStorage'
import { emptyUserFilters, type User, type UserFilters, type UserStatus } from '../types/user'
import Icon from './Icon'

const headers = ['Organization', 'Username', 'Email', 'Phone number', 'Date joined', 'Status']

interface UsersTableProps {
  users: User[]
  totalResults: number
  organizations: string[]
  filters: UserFilters
  page: number
  pageSize: number
  totalPages: number
  onFiltersChange: (filters: UserFilters) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onStatusChange: (userId: string, status: UserStatus) => void
}

function StatusPill({ status }: { status: UserStatus }) {
  return <span className={`status status--${status.toLowerCase()}`}>{status}</span>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function paginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const candidates = new Set([1, 2, current - 1, current, current + 1, total - 1, total])
  const pages = [...candidates].filter((page) => page > 0 && page <= total).sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) result.push('ellipsis')
    result.push(page)
  })
  return result
}

export default function UsersTable({
  users,
  totalResults,
  organizations,
  filters,
  page,
  pageSize,
  totalPages,
  onFiltersChange,
  onPageChange,
  onPageSizeChange,
  onStatusChange,
}: UsersTableProps) {
  const navigate = useNavigate()
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [draftFilters, setDraftFilters] = useState<UserFilters>(filters)

  useEffect(() => {
    setDraftFilters(filters)
  }, [filters])

  const updateDraft = <K extends keyof UserFilters>(name: K, value: UserFilters[K]) => {
    setDraftFilters((current) => ({ ...current, [name]: value }))
  }

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onFiltersChange(draftFilters)
    setFilterOpen(false)
  }

  const resetFilters = () => {
    setDraftFilters(emptyUserFilters)
    onFiltersChange(emptyUserFilters)
  }

  const viewDetails = (user: User) => {
    saveSelectedUser(user)
    navigate(`/users/${user.id}`)
  }

  const updateStatus = (user: User, status: UserStatus) => {
    onStatusChange(user.id, status)
    setActiveMenu(null)
  }

  return (
    <>
      <div className="users-table-card">
        <div className="users-table-scroll">
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>
                    <span>{header}</span>
                    <button
                      type="button"
                      aria-label={`Filter by ${header}`}
                      aria-expanded={filterOpen}
                      aria-controls="user-filter-panel"
                      onClick={() => setFilterOpen((open) => !open)}
                    >
                      <Icon name="filter" />
                    </button>
                  </th>
                ))}
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td data-label="Organization">{user.organization}</td>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Phone Number">{user.phoneNumber}</td>
                  <td data-label="Date Joined">{formatDate(user.dateJoined)}</td>
                  <td data-label="Status"><StatusPill status={user.status} /></td>
                  <td data-label="Actions">
                    <button
                      className="row-menu"
                      type="button"
                      aria-label={`Actions for ${user.username}`}
                      aria-expanded={activeMenu === index}
                      onClick={() => setActiveMenu((current) => current === index ? null : index)}
                    >
                      ⋮
                    </button>
                    {activeMenu === index && (
                      <div className="user-actions" role="menu">
                        <button type="button" role="menuitem" onClick={() => viewDetails(user)}><Icon name="eye" /> View Details</button>
                        <button type="button" role="menuitem" onClick={() => updateStatus(user, 'Blacklisted')}><Icon name="userCheck" /> Blacklist User</button>
                        <button type="button" role="menuitem" onClick={() => updateStatus(user, 'Active')}><Icon name="userCheck" /> Activate User</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filterOpen && (
          <form className="filter-panel" id="user-filter-panel" aria-label="Filter users" onSubmit={applyFilters}>
            <label>
              <span>Organization</span>
              <select value={draftFilters.organization} onChange={(event) => updateDraft('organization', event.target.value)}>
                <option value="">Select</option>
                {organizations.map((organization) => <option key={organization}>{organization}</option>)}
              </select>
            </label>
            <label><span>Username</span><input value={draftFilters.username} onChange={(event) => updateDraft('username', event.target.value)} placeholder="User" /></label>
            <label><span>Email</span><input type="email" value={draftFilters.email} onChange={(event) => updateDraft('email', event.target.value)} placeholder="Email" /></label>
            <label><span>Date</span><input type="date" value={draftFilters.date} onChange={(event) => updateDraft('date', event.target.value)} /></label>
            <label><span>Phone Number</span><input value={draftFilters.phoneNumber} onChange={(event) => updateDraft('phoneNumber', event.target.value)} placeholder="Phone Number" /></label>
            <label>
              <span>Status</span>
              <select value={draftFilters.status} onChange={(event) => updateDraft('status', event.target.value as UserFilters['status'])}>
                <option value="">Select</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
                <option value="Active">Active</option>
              </select>
            </label>
            <div className="filter-panel__actions">
              <button type="button" onClick={resetFilters}>Reset</button>
              <button type="submit">Filter</button>
            </div>
          </form>
        )}
      </div>

      <nav className="pagination" aria-label="Table pagination">
        <div className="pagination__count">
          Showing
          <select aria-label="Users per page" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          out of {totalResults}
        </div>
        <div className="pagination__pages">
          <button className="page-arrow" type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><Icon name="chevronLeft" /></button>
          {paginationItems(page, totalPages).map((item, index) => item === 'ellipsis'
            ? <span key={`ellipsis-${index}`}>...</span>
            : <button className={item === page ? 'current' : ''} type="button" key={item} aria-label={`Page ${item}`} onClick={() => onPageChange(item)}>{item}</button>)}
          <button className="page-arrow" type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}><Icon name="chevronRight" /></button>
        </div>
      </nav>
    </>
  )
}
