require('dns').setDefaultResultOrder('ipv4first');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketEvents = require('./socket');

dotenv.config();


// Connect to Database
console.log('Attempting to connect to MongoDB...');
connectDB();
console.log('Database connection initialized.');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Events
socketEvents(io);


// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Server Config Monitor
const VERSION = 'Onboard_v3';
console.log(`[${new Date().toISOString()}] Server started - Mode: ${VERSION}`);

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Ping Route
app.get('/api/ping', (req, res) => res.json({
    status: 'OK',
    timestamp: new Date(),
    version: VERSION,
    env: process.env.NODE_ENV
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.get('/api/influencers', require('./middleware/authMiddleware').protect, require('./controllers/authController').getInfluencers);
app.get('/api/influencers/:id', require('./middleware/authMiddleware').protect, require('./controllers/authController').getInfluencerById);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/messages', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/deliverables', require('./routes/deliverableRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/invitations', require('./routes/invitationRoutes'));

// Error handling for large payloads
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({
            message: 'Asset transmission failed: The data size exceeds the server limit. Please use a smaller imagery file (< 5MB).',
            error: 'Payload Too Large'
        });
    }
    next(err);
});

// 404 Catch-all (at the very bottom of /api)
app.use('/api/*', (req, res) => {
    console.log(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: 'Endpoint Not Found',
        method: req.method,
        path: req.originalUrl,
        hint: 'Check if the route is correctly defined in backend routes.'
    });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('CollabConnect API is running...');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 COLLAB-CONNECT SERVER LIVE ON PORT ${PORT}`));
