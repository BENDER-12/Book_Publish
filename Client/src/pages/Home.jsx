import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Illustration from '../assets/myana.jpeg'
import SnowyNook from '../assets/snowy nook.jpg'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return (
      <div style={{ 
        display: 'grid', 
        placeItems: 'center', 
        minHeight: '100dvh',
        background: 'linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(' + Illustration + ') center center / cover no-repeat fixed'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 24px 60px rgba(0,0,0,.35)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
          border: '1px solid #333'
        }}>
          <h1 style={{ color: 'white', marginBottom: '1rem' }}>Welcome back!</h1>
          <p style={{ color: '#ccc', marginBottom: '2rem' }}>You're already signed in. Go to your dashboard.</p>
          <button 
            onClick={handleDashboard}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#000',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid #333',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            fontWeight: '700'
          }}>
            BP
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6' }}>BOOK PUBLISH</div>
            <div style={{ fontSize: '12px', color: '#999' }}>Share your stories with the world</div>
          </div>
        </div>
        <button 
          onClick={handleLogin}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        minHeight: '70vh',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
          padding: '40px 32px'
        }}>
          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 48px)',
            lineHeight: '1.1',
            margin: 0,
            fontWeight: '800',
            color: 'white'
          }}>
            Publish Your Stories
            <br />
            <span style={{ color: '#3b82f6' }}>Share Your Voice</span>
          </h1>
          <p style={{
            maxWidth: '36ch',
            opacity: '0.95',
            margin: 0,
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#ccc'
          }}>
            Transform your ideas into published books. Our platform makes it easy to create, 
            publish, and share your stories with readers around the world.
          </p>
          <button 
            onClick={handleLogin}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '6px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              width: 'fit-content',
              marginTop: '1rem'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Get Started Today
          </button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px'
        }}>
          <img 
            src={Illustration} 
            alt="Reading illustration" 
            style={{
              maxWidth: '85%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,.5)'
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        background: '#111',
        borderTop: '1px solid #333'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '3rem',
            color: 'white'
          }}>
            Why Choose Book Publish?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid #333'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>📚</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6'
              }}>Easy Publishing</h3>
              <p style={{
                color: '#ccc',
                lineHeight: '1.6'
              }}>
                Upload your manuscript and publish with just a few clicks. 
                No technical knowledge required.
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid #333'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>📊</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6'
              }}>Analytics & Insights</h3>
              <p style={{
                color: '#ccc',
                lineHeight: '1.6'
              }}>
                Track your book's performance with detailed analytics. 
                Understand your readers better.
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid #333'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>🌍</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#3b82f6'
              }}>Global Reach</h3>
              <p style={{
                color: '#ccc',
                lineHeight: '1.6'
              }}>
                Reach readers worldwide. Your stories can be discovered 
                by millions of potential readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section style={{
        padding: '4rem 2rem',
        background: '#000'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              Write Wise & Gain Wisdom
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              color: '#ccc',
              lineHeight: '1.6'
            }}>
              Join thousands of authors who have already published their books 
              and reached readers around the world. Start your publishing journey today.
            </p>
            <button 
              onClick={handleLogin}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '6px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              Start Publishing Now
            </button>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src={SnowyNook} 
              alt="Snowy nook illustration" 
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,.5)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        background: '#111',
        borderTop: '1px solid #333',
        color: '#999'
      }}>
        <p>&copy; 2024 Book Publish. All rights reserved.</p>
      </footer>
    </div>
  )
} 