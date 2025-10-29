import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';

const Books = () => {
  const toCover = (cover) => {
    const fallback = '/images.jpg';
    if (!cover) return fallback;
    if (/^https?:\/\//i.test(cover)) return cover;
    // If it's a plain filename or already public path, serve from frontend public
    if (cover === 'images.jpg' || !cover.includes('/')) {
      return `/${cover.replace(/^\//, '')}`;
    }
    // Otherwise assume it's an upload filename
    return `${import.meta.env.VITE_API_URL}/uploads/${cover}`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  
  const { data: books, isLoading, error } = useBooks({
    search: searchTerm,
    genre: selectedGenre,
  });

  const genres = ['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Browse Books
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover amazing stories and adventures
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Books
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="search"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Filter by Genre
                </label>
                <select
                  id="genre"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading books
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error.message || 'Something went wrong. Please try again.'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {books?.length || 0} Books Found
                </h3>
              </div>
              <div className="border-t border-gray-200">
                {books && books.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {books.map((book) => (
                      <Link
                        key={book._id}
                        to={`/book/${book._id}`}
                        className="group block"
                      >
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                          {/* Book Cover */}
                          <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                            <img
                              className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                              src={toCover(book.coverImage)}
                              alt={book.title}
                            />
                          </div>

                          {/* Book Info */}
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 truncate">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 truncate">
                              {book.author || 'Unknown Author'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {book.description || 'No description available.'}
                            </p>
                            
                            {/* Genres */}
                            {book.genres && book.genres.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {book.genres.slice(0, 2).map((genre, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                                  >
                                    {genre}
                                  </span>
                                ))}
                                {book.genres.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{book.genres.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Stats */}
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                              <span>{book.chaptersCount || 0} chapters</span>
                              <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria or check back later for new books.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;