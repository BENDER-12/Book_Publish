import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase.js'
import Illustration from '../assets/myana.jpeg'
import './login.css'

function mapError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/missing-password':
    case 'auth/weak-password':
      return 'Please enter a stronger password (min 6 characters).'
    case 'auth/email-already-in-use':
      return 'Email already in use. Try logging in.'
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.'
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled for this project.'
    default:
      return 'Authentication failed. Please try again.'
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('reader')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(mapError(err?.code) + (err?.code ? ` (${err.code})` : ''))
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    if (!email) {
      setError('Enter your email to reset password')
      return
    }
    setError('')
    setBusy(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setError('Password reset email sent.')
    } catch (err) {
      setError(mapError(err?.code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrap">
        <div className="left-panel">
          <h1 className="hero-title">Write Wise & Gain Wisdom</h1>-m 
          <p className="hero-copy">Please use your credentials to login. If you are not a member, please register.</p>
          <img className="panel-image" src={Illustration} alt="Reading illustration" />
        </div>
        <div className="login-card">
          <div className="brand">
            <div className="logo-circle">BR</div>
            <div>
              <div className="brand-title">BOOKS</div>
              <div className="brand-sub">Books are the best way to learn</div>
            </div>
          </div>
          <h2 className="section-title">{mode === 'login' ? 'Login Here' : 'Create an Account'}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'signup' && (
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="reader"
                    checked={userType === 'reader'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <span className="radio-text">Reader</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="author"
                    checked={userType === 'author'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <span className="radio-text">Author</span>
                </label>
              </div>
            )}
            {error && <div className="error" role="alert">{error}</div>}
            <div className="actions">
              <button type="submit" className="btn" disabled={busy}>
                {busy ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Sign Up')}
              </button>
              <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                {mode === 'login' ? 'Create account' : 'Have an account? Login'}
              </button>
            </div>
          </form>
          <button className="link" onClick={handleReset}>Forget Password?</button>
        </div>
      </div>
    </div>
  )
} 