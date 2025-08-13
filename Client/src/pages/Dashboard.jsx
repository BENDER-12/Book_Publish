import { useAuth } from '../contexts/AuthContext.jsx'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
      <div>
        <h1>Welcome</h1>
        <p>Signed in as: <strong>{user?.email}</strong></p>
        <button onClick={signOut}>Sign out</button>
      </div>
    </div>
  )
} 