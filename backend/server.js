import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes and Middleware
import statusRoutes from './routes/statusRoutes.js';
import authRoutes from './routes/authroutes.js';
import { requireAdmin } from './middleware/authMiddleware.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Recommend 5000 so it doesn't conflict with React

// Global Middleware
app.use(cors()); // Crucial: Allows your React dashboard (localhost:5173) to fetch data
app.use(express.json());

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================
app.get('/', (req, res) => {
    res.send('CloudOps Autopilot API is running');
});

app.get('/health', (req, res) => {
    // Basic health check for Docker/monitoring
    res.status(200).send('Server is healthy');
});

// The login route must be public so the admin can get their token
app.use('/api/auth', authRoutes);


// ==========================================
// PROTECTED ROUTES (Requires valid JWT token)
// ==========================================
// By placing requireAdmin here, every request to /api/status is intercepted and verified
app.use('/api/status', requireAdmin, statusRoutes);


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});