const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Add this line to manage the database connection

// Database connection details
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Priya@123',
    database: 'hotelmanagementsystem',
};

// Confirm Booking API
router.post('/', async (req, res) => {
    const { hotelid, checkin, checkout, checkintime, checkouttime, paymentstatus } = req.body;

    if (!req.session.usersignupid) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        // Retrieve the user's name from the usersignup table using the usersignupid from the session
        const [userResult] = await connection.execute('SELECT customername FROM usersignup WHERE usersignupid = ?', [req.session.usersignupid]);

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const customername = userResult[0].customername;

        // Insert booking details into the bookings table
        const [result] = await connection.execute(
            'INSERT INTO bookings (hotelid, usersignupid, checkin, checkout, checkintime, checkouttime, customername, paymentstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [hotelid, req.session.usersignupid, checkin, checkout, checkintime, checkouttime, customername, paymentstatus]
        );

        // Close the connection
        await connection.end();

        res.status(201).json({ message: 'Booking confirmed', bookingId: result.insertId });
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
