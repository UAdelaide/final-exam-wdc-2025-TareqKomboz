const express = require('express');
const path = require('path');
const session = require('express-session');

require('dotenv').config();

const app = express();

// Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'my_secret123',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRouter = require('./routes/dogRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRouter);

// Export the app instead of listening here
module.exports = app;
