import { useEffect, useState } from 'react';
import { notificationsAPI } from '../api/notifications';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.list({ unread: filterUnread, limit: 50 });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const buildHref = (n) => {
    const d = n?.data || {};
    switch (n.type) {
      case 'chapter_release':
        return d.bookId ? `/read/${d.bookId}${d.chapterId ? `?chapter=${d.chapterId}` : ''}` : '/books';
      case 'author_new_book':
      case 'book_updated':
      case 'new_review':
      case 'new_comment':
      case 'review_reply':
        return d.bookId ? `/book/${d.bookId}` : '/books';
      default:
        return '/notifications';
    }
  };

  useEffect(() => {
    load();
  }, [filterUnread]);

  const markAll = async () => {
    await notificationsAPI.markAllRead();
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" checked={filterUnread} onChange={(e) => setFilterUnread(e.target.checked)} />
                <span>Show unread only</span>
              </label>
              <button onClick={markAll} className="btn btn-secondary text-sm">Mark all as read</button>
            </div>
          </div>
          {loading ? (
            <div className="p-4 text-gray-600">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-gray-600">No notifications</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((n) => (
                <li key={n._id} className={`p-0 ${n.read ? 'opacity-70' : ''}`}>
                  <button
                    onClick={() => navigate(buildHref(n))}
                    className="w-full text-left p-4 hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.body}</div>
                    <div className="mt-1 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
