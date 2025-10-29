/**
 * Navigation Bar Component
 * 
 * Main navigation component with responsive design, user authentication menu,
 * and active route highlighting. Includes mobile hamburger menu for smaller screens.
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import NotificationsBell from './NotificationsBell';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close mobile menu after logout
    navigate('/login', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FontAwesomeIcon icon={faBook} className="text-blue-600 text-xl mr-2" />
              <span className="text-2xl font-bold text-blue-600">Novashelf</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/books"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/books')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse Books
            </Link>
            {/* Payment link removed from authenticated navbar as per request */}

            {isAuthenticated && role === 'reader' && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/library"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/library')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Library
                </Link>
              </>
            )}
            {isAuthenticated && (role === 'author' || role === 'admin') && (
              <>
                <Link
                  to="/author-dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/author-dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Author
                </Link>
                <Link
                  to="/my-books"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-books')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Books
                </Link>
              </>
            )}
            {isAuthenticated && role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => document.documentElement.classList.toggle('dark')}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition"
              aria-label="Toggle dark mode"
            >
              <svg className="h-5 w-5 hidden dark:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.64 13A9 9 0 1111 2.36a7 7 0 0010.63 10.64z" />
              </svg>
              <svg className="h-5 w-5 dark:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-14a1 1 0 011-1V2a1 1 0 10-2 0v1a1 1 0 011 1zm6.364 2.636a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM4.515 4.515a1 1 0 011.414 0l.707.707A1 1 0 015.222 6.93l-.707-.707a1 1 0 010-1.414zM18 12a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4 12a1 1 0 011-1H6a1 1 0 110 2H5a1 1 0 01-1-1zm12.85 5.536a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM6.343 17.657a1 1 0 011.414 0l.707.707A1 1 0 016.05 20.485l-.707-.707a1 1 0 010-1.414z" />
              </svg>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationsBell />
                <span className="text-sm text-gray-700">Hello, {user?.name}</span>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/books"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/books')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Browse Books
              </Link>
              {/* payment link removed from mobile menu */}
              {isAuthenticated && role === 'reader' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/dashboard')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/library"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/library')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    My Library
                  </Link>
                </>
              )}
              {isAuthenticated && (role === 'author' || role === 'admin') && (
                <>
                  <Link
                    to="/author-dashboard"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/author-dashboard')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Author
                  </Link>
                  <Link
                    to="/my-books"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/my-books')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    My Books
                  </Link>
                </>
              )}
              {isAuthenticated && role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}
              
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;