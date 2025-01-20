const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // replace with your MySQL username
  password: 'Priya@123',  // replace with your MySQL password
  database: 'hotelmanagementsystem'  // replace with your database name
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});



// Endpoint to get hotel details by ID
router.get('/:id', (req, res) => {
  const hotelId = req.params.id;
  console.log('Requested hotel ID:', hotelId);

  const query = 'SELECT * FROM hoteldetails WHERE hotelid = ?';
  connection.query(query, [hotelId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      console.log(`No hotel found with ID: ${hotelId}`);
      return res.status(404).json({ error: `Hotel with ID ${hotelId} not found` });
    }

    console.log('Query results:', results);
    res.json(results[0]);
  });
});
// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
module.exports = router; // Ensure this line is presents