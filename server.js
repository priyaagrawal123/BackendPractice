const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const port = 5000;

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'your-Secret-Key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true} // Set to true in production if using HTTPS
}));
app.use(cors({
    origin: 'http://localhost:3001', // Allowing frontend to access API
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies (for JWT in cookies)
}));
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'max-age=3600');
    next();
});
app.use('/images', express.static(path.join(__dirname, 'images')));

// Import routes
const user = require('./user');  // Correct import of the user route
const confirmbookings = require('./confirmbookings');
const saveDraft = require('./saveDraft');
const hotels = require('./hotels');
const hoteldetails = require('./hoteldetails');

// Use the routes
app.use('/user', user);  // Now handling both user and profile routes inside user.js
app.use('/confirmbookings', confirmbookings);
app.use('/saveDraft', saveDraft);
app.use('/hotels', hotels);
app.use('/hoteldetails', hoteldetails);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
