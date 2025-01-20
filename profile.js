// // profile.js (Express API)
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql');
// const router = express.Router();

// // MySQL connection setup
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Priya@123',
//   database: 'hotelmanagementsystem'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   // Get token from the Authorization header
//   const token = req.headers['authorization']?.split(' ')[1]; // Bearer <TOKEN>
  
//   if (!token) {
//     return res.status(403).send({ message: 'No token provided' });
//   }
  
//   // Verify the token using your secret key
//   jwt.verify(token, 'your-secret-key', (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'Invalid token' });
//     }
//     req.user = decoded; // Attach decoded token (payload) to the request
//     next();
//   });
// };


// // Profile API to get user details and bookings
// router.get('/', authenticateToken, (req, res) => {
//   const userId = req.user.id; // Assuming the JWT contains the user ID

//   // Query to get the user's details
//   const userQuery = 'SELECT id, username, email, phonenumber FROM users WHERE id = ?';

//   // Query to get the user's bookings
//   const bookingsQuery = 'SELECT * FROM bookings WHERE userId = ?';

//   db.query(userQuery, [userId], (err, userResults) => {
//     if (err) {
//       console.error('Error fetching user details:', err);
//       return res.status(500).json({ message: 'Failed to load user details' });
//     }

//     // Check if user exists
//     if (userResults.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userDetails = userResults[0]; // Assuming a single user result

//     // Now, fetch the bookings for the user
//     db.query(bookingsQuery, [userId], (err, bookingResults) => {
//       if (err) {
//         console.error('Error fetching bookings:', err);
//         return res.status(500).json({ message: 'Failed to load bookings' });
//       }

//       // Send both user details and bookings
//       res.json({
//         status: 'success',
//         message: 'User profile fetched successfully',
//         user: userDetails,
//         bookings: bookingResults
//       });
//     });
//   });
// });


// module.exports = router; // Ensure this line is present to export the router
