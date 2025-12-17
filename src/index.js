import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js"
import cors from 'cors';
import propertyRoute from "./routes/property.routes.js";
import uploadRoute from "./routes/upload.route.js";
import reviewRoutes from './routes/review.routes.js'
import inquiryRoutes from './routes/inquiry.routes.js'


dotenv.config();
const app = express();
connectDB();





const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'https://prop-bot-rental.vercel.app' // Add if different
];

//Test Route 
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS not allowed'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());




// Health check route
app.get("/", (req, res) => {
    res.json({ 
        status: "Backend is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});



//Making Auth
app.use("/api/auth",authRoutes);

//Connecting Property routes
app.use('/api/properties',propertyRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inquiries',inquiryRoutes);




// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// ✅ For Vercel serverless, don't use app.listen in production app should be working
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        
    });
}

export default app;
