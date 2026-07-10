import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SummaryCards from '../components/SummaryCards'
import TopNav from '../components/TopNav'
import UsersTable from '../components/UsersTable'
import { fetchUsers } from '../services/usersApi'
import { emptyUserFilters, type User, type UserFilters } from '../types/user'

type RequestStatus = 'loading' | 'success' | 'error'

export default function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<UserFilters>(emptyUserFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const controller = new AbortController()
    setRequestStatus('loading')
    setErrorMessage('')

    fetchUsers(controller.signal)
      .then((data) => {
        setUsers(data)
        setRequestStatus('success')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setErrorMessage(error instanceof Error ? error.message : 'Something went wrong while loading users.')
        setRequestStatus('error')
      })

    return () => controller.abort()
  }, [retryCount])

  const organizations = useMemo(() => [...new Set(users.map((user) => user.organization))].sort(), [users])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const includes = (value: string, query: string) => value.toLowerCase().includes(query.trim().toLowerCase())

    return users.filter((user) => {
      const matchesSearch = !normalizedSearch || [
        user.username,
        user.email,
        user.phoneNumber,
        user.organization,
      ].some((value) => value.toLowerCase().includes(normalizedSearch))

      return matchesSearch &&
        includes(user.organization, filters.organization) &&
        includes(user.username, filters.username) &&
        includes(user.email, filters.email) &&
        includes(user.phoneNumber, filters.phoneNumber) &&
        (!filters.date || user.dateJoined.startsWith(filters.date)) &&
        (!filters.status || user.status === filters.status)
    })
  }, [users, search, filters])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const pageUsers = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    return filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize)
  }, [filteredUsers, page, pageSize, totalPages])

  useEffect(() => setPage(1), [search, filters, pageSize])
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers((currentUsers) => currentUsers.map((user) => (
      user.id === userId ? { ...user, status } : user
    )))
  }

  return (
    <div className="dashboard-page">
      <TopNav onMenuClick={() => setSidebarOpen(true)} searchValue={search} onSearchChange={setSearch} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-content">
        <h1>Users</h1>

        {requestStatus === 'loading' && <div className="data-state" role="status"><span className="spinner" />Loading users…</div>}

        {requestStatus === 'error' && (
          <div className="data-state data-state--error" role="alert">
            <h2>We couldn’t load users</h2>
            <p>{errorMessage}</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button>
          </div>
        )}

        {requestStatus === 'success' && (
          <>
            <SummaryCards users={users} />
            {filteredUsers.length === 0 ? (
              <div className="data-state data-state--empty">
                <h2>No users found</h2>
                <p>Try changing your search or clearing the filters.</p>
                <button type="button" onClick={() => { setSearch(''); setFilters(emptyUserFilters) }}>Clear search and filters</button>
              </div>
            ) : (
              <UsersTable
                users={pageUsers}
                totalResults={filteredUsers.length}
                organizations={organizations}
                filters={filters}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                onFiltersChange={setFilters}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onStatusChange={updateUserStatus}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
