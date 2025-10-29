import { Link } from 'react-router-dom';

const Icon = ({ path, className = 'h-6 w-6 text-primary-600' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/40 to-white">
      {/* Public navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-700">Novashelf</Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">Login</Link>
            <Link to="/register" className="text-sm text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md">Register</Link>
            <Link to="/payment" className="text-sm text-primary-700 hover:text-primary-900">Donation</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-indigo-200 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-600" /> New chapter alerts • Reviews • Comments
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Your place to publish and read captivating stories
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Authors grow audiences with releases and feedback. Readers discover, follow, and never miss a chapter.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/books" className="btn btn-secondary">Browse Books</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 max-w-md gap-6 text-center">
              {[['2k+','Readers'],['500+','Authors'],['5k+','Books & Chapters']].map(([k,v]) => (
                <div key={v}>
                  <div className="text-2xl font-bold text-gray-900">{k}</div>
                  <div className="text-sm text-gray-500">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-xl ring-1 ring-gray-100 p-6">
            <div className="grid grid-cols-2 gap-4">
              {[{
                title:'Role-based dashboards', body:'Reader, Author, Admin with tailored navigation.', icon:'M4 6h16M4 12h8m-8 6h16'
              },{
                title:'Smart notifications', body:'New chapters, reviews, and comments in real time.', icon:'M12 6v12m6-6H6'
              },{
                title:'Threaded comments', body:'Reply chains for focused discussion on books.', icon:'M4 5h16v10H5l-1 1V5z'
              },{
                title:'Follow authors', body:'Get notified when favorite authors publish.', icon:'M15 7a3 3 0 11-6 0 3 3 0 016 0z M4 21a8 8 0 1116 0H4z'
              }].map((f) => (
                <div key={f.title} className="rounded-xl border bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary-600" path={f.icon} />
                    <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">How it works</h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {[{
              step:'1', title:'Create your account', body:'Sign up as reader or author in a few clicks.'
            },{
              step:'2', title:'Explore & publish', body:'Readers build libraries; authors create books and chapters.'
            },{
              step:'3', title:'Engage & get notified', body:'Comments, reviews, and release alerts keep you connected.'
            }].map((s) => (
              <div key={s.step} className="rounded-xl border p-6 text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-primary-600 text-white grid place-items-center text-sm font-semibold">{s.step}</div>
                <h3 className="mt-3 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              quote:'Novashelf made it simple to publish weekly chapters and grow a loyal reader base.', author:'Aisha, Author'
            },{
              quote:'I never miss a release from my favorite authors. The notifications are spot on.', author:'Rahul, Reader'
            },{
              quote:'Reviews and replies keep the conversation thoughtful and focused.', author:'Meera, Reviewer'
            }].map((t) => (
              <div key={t.author} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <p className="text-gray-700">“{t.quote}”</p>
                <div className="mt-3 text-sm font-medium text-gray-900">{t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl font-bold">Support the platform</h2>
          <p className="mt-2 text-white/90">If you enjoy Novashelf, consider a small donation to help us improve.</p>
          <Link to="/payment" className="mt-4 inline-block bg-white text-primary-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium">Donate via Razorpay</Link>
        </div>
      </section>

      <footer className="py-8 border-t text-center text-sm text-gray-500">© {new Date().getFullYear()} Novashelf</footer>
    </div>
  );
};

export default Landing;
