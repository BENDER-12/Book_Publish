import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { queryClient } from './utils/queryClient';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReaderDashboard from './pages/ReaderDashboard';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Debug from './pages/Debug';
import CreateBook from './pages/CreateBook';
import MyBooks from './pages/MyBooks';
import ManageChapters from './pages/ManageChapters';
import AuthorDashboard from './pages/AuthorDashboard';
import Reader from './pages/Reader';
import Favorite from './pages/Favorite';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorite" element={
                <ProtectedRoute>
                  <Favorite/>
                </ProtectedRoute>
                } />

              <Route path="/debug" element={<Debug />} />
              
              {/* Protected routes with layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["reader"]}>
                    <Layout>
                      <ReaderDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Books />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BookDetails />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Library />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Book Management Routes */}
              <Route
                path="/my-books"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MyBooks />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-book"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateBook />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:bookId/chapters"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ManageChapters />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/read/:bookId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Reader />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/author-dashboard"
                element={
                  <ProtectedRoute roles={["author","admin"]}>
                    <Layout>
                      <AuthorDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
                          <p className="text-gray-600 dark:text-gray-300 mb-8">Page not found</p>
                          <a href="/" className="btn btn-primary">
                            Go Home
                          </a>
                        </div>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
