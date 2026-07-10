import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import illustration from '../assets/images/login-illustration.svg'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../services/auth'

interface LoginErrors {
  email?: string
  password?: string
}

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  if (session) return <Navigate to="/users" replace />

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: LoginErrors = {}

    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'

    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    login(email.trim())
    const destination = (location.state as { from?: string } | null)?.from ?? '/users'
    navigate(destination, { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Lendsqr">
        <img className="login-visual__logo" src={logo} alt="Lendsqr" />
        <img className="login-visual__illustration" src={illustration} alt="" />
      </section>
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <header className="login-form__header"><h1>Welcome!</h1><p>Enter details to login.</p></header>
          <div className="login-form__fields">
            <label className={`field ${errors.email ? 'field--invalid' : ''}`}>
              <span className="sr-only">Email</span>
              <input
                type="email"
                value={email}
                placeholder="Email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email && <span className="field__error" id="email-error" role="alert">{errors.email}</span>}
            </label>
            <label className={`field field--password ${errors.password ? 'field--invalid' : ''}`}>
              <span className="sr-only">Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button className="field__toggle" type="button" onClick={() => setShowPassword((shown) => !shown)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
              {errors.password && <span className="field__error" id="password-error" role="alert">{errors.password}</span>}
            </label>
          </div>
          <button className="forgot-password" type="button">Forgot password?</button>
          <button className="login-button" type="submit">Log in</button>
        </form>
      </section>
    </main>
  )
}
