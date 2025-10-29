const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// Security & performance
app.use(cors({
  origin: 'http://localhost:5173', // React dev port
  credentials: true
}));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Debug: log all incoming requests (helps verify correct server is handling traffic)
app.use((req, res, next) => {
  console.log('[HTTP]', req.method, req.originalUrl);
  next();
});

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('API is running...'));

console.log('[Boot] Mounting /api/auth routes');
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
