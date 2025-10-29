import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { useLibrary } from '../hooks/useLibrary';
import { CardLoader } from '../components/Loader';

const ReaderDashboard = () => {
  const toCover = (cover) => {
    const fallback = 'https://94fa3c88.delivery.rocketcdn.me/en/files/2023/10/bucket-gcp.webp';
    if (!cover) return fallback;
    if (/^https?:\/\//i.test(cover)) return cover;
    return `${import.meta.env.VITE_API_URL}/uploads/${cover}`;
  };
  const { user } = useAuth();
  const favoriteGenres = user?.favoriteGenres || [];
  const { data: recentBooks, isLoading: recentLoading } = useBooks({ limit: 6 });
  const { data: recommendedBooks, isLoading: recLoading } = useBooks(
    favoriteGenres?.length ? { genres: favoriteGenres.join(','), limit: 6 } : { enabled: false }
  );
  const { data: library, isLoading: libraryLoading } = useLibrary();

  const libraryCount = libraryLoading ? null : (library?.books?.length || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="mt-1 text-sm text-gray-600">Here is your reading overview.</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Books in Library</dt>
                      <dd className="text-lg font-medium text-gray-900">{libraryCount ?? '...'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <a href="/books" className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Browse Books</dt>
                      <dd className="text-lg font-medium text-gray-900">Discover new reads</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </a>
            <a href="/library" className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">My Library</dt>
                      <dd className="text-lg font-medium text-gray-900">Access your saved books</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {favoriteGenres.length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recommended for you</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your favorite genres: {favoriteGenres.join(', ')}</p>
              </div>
              <div className="border-t border-gray-200">
                {recLoading ? (
                  <CardLoader text="Loading recommendations..." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recommendedBooks?.map((book) => (
                      <div key={book._id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <img className="h-16 w-12 rounded object-cover" src={toCover(book.coverImage)} alt={book.title} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-sm text-gray-500 truncate">{book.author || 'Unknown Author'}</p>
                            <p className="text-xs text-gray-400">{book.genres?.join(', ') || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recently Added Books</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Discover the latest additions.</p>
            </div>
            <div className="border-t border-gray-200">
              {recentLoading ? (
                <CardLoader text="Loading recent books..." />
              ) : (
                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentBooks?.map((book) => (
                    <div key={book._id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <img className="h-16 w-12 rounded object-cover" src={toCover(book.coverImage)} alt={book.title} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                          <p className="text-sm text-gray-500 truncate">{book.author || 'Unknown Author'}</p>
                          <p className="text-xs text-gray-400">{book.chaptersCount || 0} chapters</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboard;
