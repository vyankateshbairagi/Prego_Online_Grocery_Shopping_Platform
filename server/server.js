import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

const configuredOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()),
].filter(Boolean)

const normalizeOrigin = (origin) => {
    try {
        return new URL(origin).origin
    } catch {
        return null
    }
}

const allowedOrigins = new Set(configuredOrigins.map(normalizeOrigin).filter(Boolean))

const isAllowedOrigin = (origin) => {
    const normalized = normalizeOrigin(origin)
    if (!normalized) return false
    if (allowedOrigins.has(normalized)) return true

    // Allow Vercel preview deployments for this frontend.
    return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized)
}

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`))
    },
    credentials: true,
}));


app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, ()=>{
    
    console.log(`Server is running on http://localhost:${port}`)
})