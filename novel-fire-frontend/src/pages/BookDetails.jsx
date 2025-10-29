import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBook, useBookReviews, useCreateReview } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { useAddToLibrary } from '../hooks/useLibrary';
import { libraryAPI } from '../api/library';
import { commentsAPI } from '../api/comments';
import { usersAPI } from '../api/users';

const BookDetails = () => {
  const toCover = (cover) => {
    const fallback = '/images.jpg';
    if (!cover) return fallback;
    if (/^https?:\/\//i.test(cover)) return cover;
    if (cover === 'images.jpg' || !cover.includes('/')) {
      return `/${cover.replace(/^\//, '')}`;
    }
    return `${import.meta.env.VITE_API_URL}/uploads/${cover}`;
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: book, isLoading, error } = useBook(id);
  const addToLibrary = useAddToLibrary();
  const { data: reviews, isLoading: reviewsLoading } = useBookReviews(id);
  const createReview = useCreateReview();
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const [reviewReplyOpen, setReviewReplyOpen] = useState({});
  const [reviewReplyText, setReviewReplyText] = useState({});

  const [comments, setComments] = useState([]);
  const loadComments = async () => {
    const data = await commentsAPI.list({ targetType: 'book', targetId: id });
    setComments(data);
  };

  useEffect(() => {
    if (id) loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const threadComments = () => {
    const byParent = {};
    comments.forEach((c) => {
      const pid = c.parentId || 'root';
      byParent[pid] = byParent[pid] || [];
      byParent[pid].push(c);
    });
    return byParent;
  };

  const renderThread = (parentId = null, level = 0, byParent) => {
    const list = byParent[parentId || 'root'] || [];
    return (
      <ul className={`mt-3 space-y-3 ${level > 0 ? 'ml-6' : ''}`}>
        {list.map((c) => (
          <li key={c._id} className="rounded-md border border-gray-200 p-3">
            <div className="text-sm text-gray-900">{c.user?.name || 'User'}</div>
            <div className="text-sm text-gray-700">{c.content}</div>
            <div className="mt-1 text-xs text-gray-400 flex items-center gap-4">
              <span>{new Date(c.createdAt).toLocaleString()}</span>
              <button className="text-xs text-primary-600" onClick={() => setReplyOpen((m) => ({ ...m, [c._id]: !m[c._id] }))}>Reply</button>
            </div>
            {replyOpen[c._id] && (
              <form
                className="mt-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const text = (replyText[c._id] || '').trim();
                  if (!text) return;
                  await commentsAPI.create({ targetType: 'book', targetId: id, content: text, parentId: c._id });
                  setReplyText((m) => ({ ...m, [c._id]: '' }));
                  setReplyOpen((m) => ({ ...m, [c._id]: false }));
                  await loadComments();
                }}
              >
                <textarea
                  rows={2}
                  className="w-full rounded-md border-gray-300 text-sm"
                  placeholder="Write a reply..."
                  value={replyText[c._id] || ''}
                  onChange={(e) => setReplyText((m) => ({ ...m, [c._id]: e.target.value }))}
                />
                <div className="mt-1">
                  <button type="submit" className="btn btn-secondary text-xs">Reply</button>
                </div>
              </form>
            )}
            {renderThread(c._id, level + 1, byParent)}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="lg:flex lg:items-start lg:space-x-8">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img
                  className="w-64 h-96 object-cover rounded-lg shadow-md"
                  src={toCover(book.coverImage)}
                  alt={book.title}
                />
              </div>

              {/* Book Details */}
              <div className="mt-6 lg:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-lg text-gray-600 mt-2">
                  by {book.author || 'Unknown Author'}
                </p>
                {user && book.user && user._id !== book.user && (
                  <div className="mt-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={async () => {
                        try { await usersAPI.follow(book.user); } catch {}
                      }}
                    >
                      Follow Author
                    </button>
                  </div>
                )}

                {/* Genres */}
                {book.genres && book.genres.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    {book.description || 'No description available for this book.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <dt className="text-sm font-medium text-gray-500">Chapters</dt>
                    <dd className="text-2xl font-bold text-gray-900">{book.chaptersCount || 0}</dd>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <dt className="text-sm font-medium text-gray-500">Published</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </div>

                {/* Reviews */}
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
                  {reviewsLoading ? (
                    <div className="mt-3 text-gray-600">Loading reviews...</div>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {reviews.length === 0 ? (
                        <li className="text-gray-600">No reviews yet.</li>
                      ) : (
                        reviews.map((r) => (
                          <li key={r._id} className="rounded-md border border-gray-200 p-3">
                            <img className="h-16 w-12 rounded object-cover" src={toCover(book.coverImage)} alt={book.title} />
                            <div className="text-sm text-gray-900 font-medium">Rating: {r.rating}/5</div>
                            <div className="text-sm text-gray-700">{r.comment}</div>
                            <div className="text-xs text-gray-400 mt-1">by {r.user?.name || 'Anonymous'}</div>
                            <div className="mt-2">
                              <button className="text-xs text-primary-600" onClick={() => setReviewReplyOpen((m) => ({ ...m, [r._id]: !m[r._id] }))}>Reply</button>
                            </div>
                            {reviewReplyOpen[r._id] && (
                              <form
                                className="mt-2 space-y-2"
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const text = (reviewReplyText[r._id] || '').trim();
                                  if (!text) return;
                                  await commentsAPI.create({ targetType: 'review', targetId: r._id, content: text });
                                  setReviewReplyText((m) => ({ ...m, [r._id]: '' }));
                                  setReviewReplyOpen((m) => ({ ...m, [r._id]: false }));
                                }}
                              >
                                <textarea
                                  rows={2}
                                  className="w-full rounded-md border-gray-300 text-sm"
                                  placeholder="Write a reply to this review..."
                                  value={reviewReplyText[r._id] || ''}
                                  onChange={(e) => setReviewReplyText((m) => ({ ...m, [r._id]: e.target.value }))}
                                />
                                <button type="submit" className="btn btn-secondary text-xs">Reply</button>
                              </form>
                            )}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>

                {/* Comments */}
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">Comments</h3>
                  {comments.length === 0 ? (
                    <div className="mt-3 text-gray-600">No comments yet.</div>
                  ) : (
                    renderThread()
                  )}
                  <form
                    className="mt-2 space-y-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const text = (replyText['root'] || '').trim();
                      if (!text) return;
                      await commentsAPI.create({ targetType: 'book', targetId: id, content: text });
                      setReplyText((m) => ({ ...m, ['root']: '' }));
                      await loadComments();
                    }}
                  >
                    <textarea
                      rows={2}
                      className="w-full rounded-md border-gray-300 text-sm"
                      placeholder="Write a comment..."
                      value={replyText['root'] || ''}
                      onChange={(e) => setReplyText((m) => ({ ...m, ['root']: e.target.value }))}
                    />
                    <button type="submit" className="btn btn-secondary text-xs">Comment</button>
                  </form>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-3 items-center">
                  <button
                    className="btn btn-primary"
                    disabled={addToLibrary.isPending}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await addToLibrary.mutateAsync(book._id);
                        navigate('/library');
                      } catch (err) {
                        // Optional: feedback
                      }
                    }}
                  >
                    {addToLibrary.isPending ? 'Adding...' : 'Add to Library'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        // Ensure in library and set initial progress
                        await addToLibrary.mutateAsync(book._id).catch(() => {});
                        await libraryAPI.updateProgress({ bookId: book._id, progressPercent: 0 });
                        // Open Reader view
                        navigate(`/read/${book._id}`);
                      } catch (err) {
                        // Optional: feedback
                      }
                    }}
                  >
                    Start Reading
                  </button>

                  {/* Manage Chapters for owner */}
                  {user && book.user === user._id && (
                    <Link to={`/manage-chapters/${book._id}`} className="btn btn-outline">
                      Manage Chapters
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;