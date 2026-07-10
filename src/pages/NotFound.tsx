import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

export default function NotFound() {
  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <section className="not-found-card">
        <span className="not-found-card__code">404</span>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <div>
          <Link to="/dashboard">Go to Dashboard</Link>
          <Link to="/users"><Icon name="users" /> View Users</Link>
        </div>
      </section>
    </main>
  )
}
