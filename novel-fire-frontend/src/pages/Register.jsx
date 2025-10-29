import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import OTPVerification from '../components/OTPVerification';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const { register, loading, error, pendingVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!['reader', 'author'].includes(formData.role)) {
      newErrors.role = 'Please select a valid role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setVerificationData({
        userId: data.userId,
        email: data.email,
      });
      setShowOTPVerification(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleVerificationComplete = () => {
    navigate('/favorite');
  };

  // Show OTP verification screen if needed
  if (showOTPVerification && verificationData) {
    return (
      <OTPVerification
        userId={verificationData.userId}
        email={verificationData.email}
        onVerificationComplete={handleVerificationComplete}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Project promo */}
        <div className="hidden md:block">
          <div className="glass rounded-xl p-6 md:p-8">
            <div className="inline-flex items-center space-x-2">
              <FontAwesomeIcon icon={faBook} className="text-primary-600 text-2xl" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Novashelf</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">Join our community of readers and authors</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Create an account to build your library, publish your books, and track your reading journey.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Personalized dashboard and progress</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Author workspace to create and manage chapters</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-600" />
                <span className="text-gray-700 dark:text-gray-300">Discover new books curated just for you</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md md:ml-auto">
          <div className="card card-hover p-6 sm:p-8">
            <div className="text-center">
              {/* Brand logo */}
              <div className="inline-flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faBook} className="text-primary-600 text-2xl" />
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Novashelf</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create your account</h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`mt-1 block w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.name ? 'border-red-300 dark:border-red-900' : 'border-gray-300 dark:border-gray-700'}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`mt-1 block w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.email ? 'border-red-300 dark:border-red-900' : 'border-gray-300 dark:border-gray-700'}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`block w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.password ? 'border-red-300 dark:border-red-900' : 'border-gray-300 dark:border-gray-700'}`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className={`mt-1 block w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.confirmPassword ? 'border-red-300 dark:border-red-900' : 'border-gray-300 dark:border-gray-700'}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="role"
                        value="reader"
                        checked={formData.role === 'reader'}
                        onChange={handleChange}
                      />
                      Reader
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="role"
                        value="author"
                        checked={formData.role === 'author'}
                        onChange={handleChange}
                      />
                      Author
                    </label>
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-3">
                  <div className="text-sm text-red-800 dark:text-red-300">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
              <div>
                <Link
                  to="/login"
                  className="btn btn-secondary w-full mt-3 inline-flex justify-center"
                >
                  I already have an account
                </Link>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="px-3 text-xs uppercase tracking-wider text-gray-500">or continue with</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Social placeholders */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button type="button" title="Google (coming soon)" aria-disabled className="flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.108,6.053,28.761,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.108,6.053,28.761,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.409-5.197l-6.191-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.277-7.953l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.092,5.609 c0.001-0.001,0.002-0.001,0.003-0.002l6.191,5.238C36.969,39.282,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
              </button>
              <button type="button" title="GitHub (coming soon)" aria-disabled className="flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.6 8.2 11.1.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.5-1.5-1.9-1.5-1.9-1.3-.9.1-.9.1-.9 1.4.1 2.1 1.5 2.1 1.5 1.2 2.1 3.1 1.5 3.9 1.2.1-.9.5-1.5.8-1.8-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.7 11.7 0 0 1 6.2 0C19.1 4.5 20 4.8 20 4.8c.6 1.6.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.8 5.7-5.4 6 .4.3.8 1.1.8 2.3v3.4c0 .3.2.7.8.6 4.8-1.6 8.2-5.9 8.2-11.1A11.5 11.5 0 0 0 12 .5z"/></svg>
              </button>
              <button type="button" title="Twitter (coming soon)" aria-disabled className="flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646A4.118 4.118 0 0 0 21.447 4a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 10.5 8.739a11.65 11.65 0 0 1-8.457-4.287A4.106 4.106 0 0 0 3.313 9.93a4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 15.407a11.616 11.616 0 0 0 6.29 1.84"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;