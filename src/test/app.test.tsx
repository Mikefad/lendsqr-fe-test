import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'
import Login from '../pages/Login'
import UserDetails from '../pages/UserDetails'
import Users from '../pages/Users'
import { SESSION_STORAGE_KEY } from '../services/auth'
import type { User } from '../types/user'

const userRecord: User = {
  id: 'LSQ000001',
  organization: 'Lendsqr',
  username: 'grace.effiom1',
  fullName: 'Grace Effiom',
  email: 'grace@lendsqr.com',
  phoneNumber: '08012345678',
  dateJoined: '2023-01-01T10:00:00.000Z',
  status: 'Active',
  bvn: '22123456789',
  gender: 'Female',
  maritalStatus: 'Single',
  children: 'None',
  residenceType: 'Rented Apartment',
  educationLevel: 'B.Sc',
  employmentStatus: 'Employed',
  employmentSector: 'FinTech',
  employmentDuration: '2 years',
  officeEmail: 'grace.office@lendsqr.com',
  monthlyIncome: '₦200,000.00–₦400,000.00',
  loanRepayment: '40000',
  twitter: '@grace_effiom',
  facebook: 'Grace Effiom',
  instagram: '@grace_effiom',
  tier: 1,
  balance: 200000,
  bankAccount: '9912345678',
  bankName: 'Providus Bank',
  hasLoan: true,
  hasSavings: true,
  guarantors: [{ fullName: 'Debby Ogana', phoneNumber: '07012345678', email: 'debby@mail.com', relationship: 'Sister' }],
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<div>Users route</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

function setSession() {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    email: 'admin@lendsqr.com',
    displayName: 'admin',
    createdAt: new Date().toISOString(),
  }))
}

describe('authentication', () => {
  it('shows validation errors for invalid login fields', async () => {
    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument()
  })

  it('stores a session after a successful login', async () => {
    const interaction = userEvent.setup()
    renderLogin()
    await interaction.type(screen.getByPlaceholderText('Email'), 'admin@lendsqr.com')
    await interaction.type(screen.getByPlaceholderText('Password'), 'secret123')
    await interaction.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Users route')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) ?? '{}').email).toBe('admin@lendsqr.com')
  })

  it('redirects an unauthenticated protected route to login', async () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/users" element={<div>Protected users</div>} />
            </Route>
            <Route path="/login" element={<div>Login destination</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Login destination')).toBeInTheDocument()
    expect(screen.queryByText('Protected users')).not.toBeInTheDocument()
  })
})

describe('users page states', () => {
  it('shows a loading state while users are being fetched', () => {
    setSession()
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}))

    render(<MemoryRouter><AuthProvider><Users /></AuthProvider></MemoryRouter>)
    expect(screen.getByRole('status')).toHaveTextContent('Loading users')
  })

  it('shows an empty state after a search has no matches', async () => {
    setSession()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([userRecord]), { status: 200 }))

    render(<MemoryRouter><AuthProvider><Users /></AuthProvider></MemoryRouter>)
    await screen.findByText('grace.effiom1', {}, { timeout: 2000 })
    fireEvent.change(screen.getByRole('searchbox', { name: /search users/i }), { target: { value: 'not-a-real-user' } })

    expect(await screen.findByText('No users found')).toBeInTheDocument()
  })
})

describe('user details', () => {
  it('shows a fallback when localStorage has no selected user and the route ID is not found', async () => {
    setSession()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }))

    render(
      <MemoryRouter initialEntries={['/users/LSQ404']}>
        <AuthProvider>
          <Routes>
            <Route path="/users/:userId" element={<UserDetails />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('User not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to Users' })).toHaveAttribute('href', '/users')
  })
})
