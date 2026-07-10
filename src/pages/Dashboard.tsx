import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import SummaryCards from '../components/SummaryCards'
import TopNav from '../components/TopNav'
import { fetchUsers } from '../services/usersApi'
import type { User } from '../types/user'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setFailed(false)

    fetchUsers(controller.signal)
      .then(setUsers)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [retryCount])

  return (
    <div className="dashboard-page">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard-content dashboard-overview">
        <div className="dashboard-overview__heading">
          <h1>Dashboard</h1>
          <Link to="/users">View all users</Link>
        </div>

        {loading && <div className="data-state" role="status"><span className="spinner" />Loading dashboard…</div>}
        {failed && (
          <div className="data-state" role="alert">
            <h2>We couldn’t load the dashboard</h2>
            <p>Check your connection and try again.</p>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button>
          </div>
        )}
        {!loading && !failed && (
          <>
            <SummaryCards users={users} />
            <section className="recent-users-card">
              <div><h2>Recent Users</h2><Link to="/users">Open users page</Link></div>
              <ul>
                {users.slice(0, 5).map((user) => (
                  <li key={user.id}>
                    <span className="recent-users-card__avatar">{user.fullName.charAt(0)}</span>
                    <span><strong>{user.fullName}</strong><small>{user.email}</small></span>
                    <span className={`status status--${user.status.toLowerCase()}`}>{user.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
