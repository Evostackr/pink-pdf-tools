import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure Promise.withResolvers polyfill for older browser engines
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-primary, #09090d)',
          color: 'var(--text-primary, #ffffff)'
        }}>
          <h2 style={{ color: 'var(--pink-primary, #ff2d75)', marginBottom: '1rem', fontSize: '1.8rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary, #a1a1aa)', maxWidth: '500px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff2d75 0%, #ff6699 100%)',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
