import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport'; // Assuming passport config is in 'config/passport.ts'
import authRoutes from './routes/auth'; // Assuming auth routes are in 'routes/auth.ts'
import reviewRoutes from './routes/reviews'; // Import review routes
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; // Default MongoDB URI

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: false, // Changed to false as per best practices
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(authRoutes); // Mount authentication routes
app.use('/api/reviews', reviewRoutes); // Mount review routes under /api/reviews

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! <a href="/auth/google">Login with Google</a>. <a href="/api/reviews">View Reviews</a>');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
