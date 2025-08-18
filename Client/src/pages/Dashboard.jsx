import { useAuth } from '../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }



  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a202c', fontSize: '1.5rem', fontWeight: '600' }}>
            Book Publish Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#4a5568' }}>
            Welcome, <strong>{user?.email}</strong>
          </span>
          <button 
            onClick={handleSignOut}
            style={{
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'books', label: 'My Books' },
            { id: 'publish', label: 'Publish New' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                color: activeTab === tab.id ? '#3182ce' : '#4a5568',
                borderBottom: activeTab === tab.id ? '2px solid #3182ce' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ color: '#1a202c', marginBottom: '1.5rem' }}>Dashboard Overview</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #3182ce'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Total Books</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3182ce', margin: 0 }}>12</p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #38a169'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Published</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38a169', margin: 0 }}>8</p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #d69e2e'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Drafts</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d69e2e', margin: 0 }}>4</p>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: '4px solid #e53e3e'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>Total Views</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e', margin: 0 }}>1,234</p>
              </div>
            </div>
            
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Recent Activity</h3>
              <div style={{ color: '#4a5568' }}>
                <p>• "The Great Adventure" was published 2 days ago</p>
                <p>• "Mystery Manor" draft was updated yesterday</p>
                <p>• "Science Fiction Collection" received 50 new views</p>
                <p>• New book "Poetry Anthology" was created 3 days ago</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <h2 style={{ color: '#1a202c', marginBottom: '1.5rem' }}>My Books</h2>
            <p style={{ color: '#4a5568' }}>Your published and draft books will appear here.</p>
          </div>
        )}

        {activeTab === 'publish' && (
          <div>
            <h2 style={{ color: '#1a202c', marginBottom: '1.5rem' }}>Publish New Book</h2>
            <p style={{ color: '#4a5568' }}>Create and publish your next masterpiece.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ color: '#1a202c', marginBottom: '1.5rem' }}>Analytics</h2>
            <p style={{ color: '#4a5568' }}>View detailed analytics about your books' performance.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ color: '#1a202c', marginBottom: '1.5rem' }}>Settings</h2>
            <p style={{ color: '#4a5568' }}>Manage your account and publishing preferences.</p>
          </div>
        )}
      </main>
    </div>
  )
} 