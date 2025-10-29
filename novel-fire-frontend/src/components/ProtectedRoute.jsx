/**
 * Protected Route Component
 * 
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to login page with return URL.
 * Shows loading state while authentication is being verified.
 */

import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loader';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while verifying authentication
  if (loading) {
    return <PageLoader text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Optional role guard
  if (roles && roles.length > 0) {
    const role = user?.role;
    if (!role || !roles.includes(role)) {
      // Redirect to appropriate dashboard based on role
      const target = role === 'admin' ? '/admin' : role === 'author' ? '/author-dashboard' : '/dashboard';
      return <Navigate to={target} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;