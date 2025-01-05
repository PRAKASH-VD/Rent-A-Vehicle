import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import restaurantRoutes from './routes/restaurantRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import dashboard from './routes/dashboard.js';




// Load environment variables
dotenv.config({ path: './.env' });;

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: process.env.CLIENT_URL || 'http://localhost:5173',
    // methods: ['GET', 'POST'],
    origin: '*'
  },
});


// Middleware
app.use(cors());
app.use(express.json());

// Make io available in routes
app.set('io', io);


// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations' ,recommendationRoutes)
app.use('/api/dashboard',dashboard)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL ,)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
  
  
app.get('/', (req, res) => {
  res.redirect('/api' );
});
app.get('/api/', (req, res) => {
  res.json({
      sucess: true ,
       message : " Welcome to the API , connected to the DB" });
  });



// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join_restaurant', (restaurantId) => {
    socket.join(restaurantId);
  });

  socket.on('reservation_update', (data) => {
    io.to(data.restaurantId).emit('reservation_status', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT ;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}` );
});