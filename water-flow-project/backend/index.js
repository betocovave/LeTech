const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Log more specific connection error details
  if (err.name === 'MongoNetworkError') {
    console.error('Network connectivity issue. Check your internet connection and MongoDB URI.');
  } else if (err.name === 'MongoServerSelectionError') {
    console.error('Unable to connect to MongoDB server. Check if server is running and credentials are correct.');
  }
});

// Authentication Routes
const authController = require('./controllers/authController');
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// Protected Data Routes
const dataController = require('./controllers/dataController');
app.get('/data', auth, dataController.getData);

app.get('/', (req, res) => {
  res.send('Water Flow Project Backend');
});

const chatbotController = require('./controllers/chatbotController');
app.post('/chatbot', chatbotController.getChatbotResponse);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});