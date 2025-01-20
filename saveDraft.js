const express = require('express');
const router = express.Router();
const db = require('./db');  // MySQL connection
const authenticateToken = require('./authenticateToken');  // JWT authentication middleware

// Endpoint to save the draft
router.post('/saveDraft', authenticateToken, async (req, res) => {
  const { draftData } = req.body; // Assuming draftData contains booking-related details

  // Validate if draftData is provided in the request body
  if (!draftData) {
    return res.status(400).json({
      status: 'error',
      message: 'Draft data is required'
    });
  }

  try {
    const userId = req.user.id; // Extract userId from authenticated token

    // Retrieve user info from the database based on userId
    const userQuery = 'SELECT email, username FROM usersignup WHERE id = ?';
    
    // Use a promise-based query to avoid callback hell and improve readability
    db.promise().query(userQuery, [userId])
      .then(([result]) => {
        if (result.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'User not found'
          });
        }

        const user = result[0];
        const { email, username } = user; // Extract email and username

        // Ensure the draftData contains all required fields
        const { checkin, checkout, checkintime, checkouttime, createdate } = draftData;
        if (!checkin || !checkout || !checkintime || !checkouttime || !createdate) {
          return res.status(400).json({
            status: 'error',
            message: 'Missing required fields in draftData (checkin, checkout, checkintime, checkouttime, createdate)'
          });
        }

        // Save the draft data into the database with the user information
        const saveDraftQuery = `
          INSERT INTO draftbookings (userId, email, username, draftData)
          VALUES (?, ?, ?, ?)
        `;

        db.promise().query(saveDraftQuery, [userId, email, username, JSON.stringify(draftData)])
          .then(([result]) => {
            res.status(200).json({
              status: 'success',
              message: 'Draft saved successfully',
              draftId: result.insertId  // The ID of the inserted draft
            });
          })
          .catch((err) => {
            console.error('Error saving draft to database:', err.stack);
            res.status(500).json({ message: 'Failed to save draft' });
          });
      })
      .catch((err) => {
        console.error('Error querying user info:', err.stack);
        res.status(500).json({ message: 'Database query failed' });
      });

  } catch (error) {
    console.error('Error handling the draft save request:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
