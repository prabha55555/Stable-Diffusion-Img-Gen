import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import postRoutes from './routes/postRoutes.js';
import huggingRoutes from './routes/huggingRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors({
    origin: ['https://genimageb10.vercel.app', 'http://localhost:5173'], 
    methods: ['GET', 'POST'],
    credentials: true
  }));
app.use(express.json({ limit: '50mb' }));

// Routes
app.get('/', (req, res) => {
  res.send("Hello from AI Image Generator API!");
});

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', huggingRoutes); 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});