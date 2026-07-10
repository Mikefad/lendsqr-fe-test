import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'
import UserInformation from '../components/UserInformation'
import UserProfileCard from '../components/UserProfileCard'
import { getSelectedUser, saveSelectedUser } from '../services/userStorage'
import { fetchUsers } from '../services/usersApi'
import type { User } from '../types/user'

type DetailsStatus = 'loading' | 'success' | 'not-found' | 'error'

export default function UserDetails() {
  const { userId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<DetailsStatus>('loading')

  const updateStatus = (nextStatus: User['status']) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser
      const updatedUser = { ...currentUser, status: nextStatus }
      saveSelectedUser(updatedUser)
      return updatedUser
    })
  }

  useEffect(() => {
    if (!userId) {
      setStatus('not-found')
      return
    }

    const storedUser = getSelectedUser()
    if (storedUser?.id === userId) {
      setUser(storedUser)
      setStatus('success')
      return
    }

    const controller = new AbortController()
    setStatus('loading')

    fetchUsers(controller.signal)
      .then((users) => {
        const matchedUser = users.find((candidate) => candidate.id === userId) ?? null
        if (!matchedUser) {
          setUser(null)
          setStatus('not-found')
          return
        }

        saveSelectedUser(matchedUser)
        setUser(matchedUser)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setUser(null)
        setStatus('error')
      })

    return () => controller.abort()
  }, [userId])

  return (
    <div className="dashboard-page user-details-page">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="user-details-content">
        <Link className="back-to-users" to="/users"><Icon name="arrowLeft" /> Back to Users</Link>

        {status === 'loading' && <div className="data-state" role="status"><span className="spinner" />Loading user details…</div>}

        {status === 'error' && (
          <div className="details-fallback" role="alert">
            <h1>User details unavailable</h1>
            <p>We could not load this user profile. Return to Users and try again.</p>
            <Link to="/users">Return to Users</Link>
          </div>
        )}

        {status === 'not-found' && (
          <div className="details-fallback" role="alert">
            <h1>User not found</h1>
            <p>This user could not be found in the mock dataset.</p>
            <Link to="/users">Return to Users</Link>
          </div>
        )}

        {status === 'success' && user && (
          <>
            <div className="user-details-heading">
              <h1>User Details</h1>
              <div>
                <button className="outline-action outline-action--danger" type="button" onClick={() => updateStatus('Blacklisted')}>Blacklist User</button>
                <button className="outline-action outline-action--success" type="button" onClick={() => updateStatus('Active')}>Activate User</button>
              </div>
            </div>
            <UserProfileCard user={user} />
            <UserInformation user={user} />
          </>
        )}
      </main>
    </div>
  )
}
