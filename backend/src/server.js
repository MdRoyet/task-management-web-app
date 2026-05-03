const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { Server } = require('socket.io');

const routes = require('./routes');
const socketHandler = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true // allow cookies
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Main API routes
app.use('/api', routes);

// Setup Socket.io
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
