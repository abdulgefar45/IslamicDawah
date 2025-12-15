const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('../client'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-dawah', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const User = require('./models/User');
const Question = require('./models/Question');
const Article = require('./models/Article');

// Auth Middleware
const auth = require('./middleware/auth');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admin', require('./routes/admin'));

// Public routes
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find({ published: true });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/questions/public', async (req, res) => {
    try {
        const questions = await Question.find({ answered: true, public: true })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve client
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../client' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
