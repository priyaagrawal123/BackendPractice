const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Use the new MySQL username
  password: 'Priya@123', // Use the new MySQL password
  database: 'hotelmanagementsystem' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

// Route to get data from MySQL
app.get('/data', (req, res) => {
  connection.query('select * from hotels', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});
// console.error('Error fetching data:', err.stack);

// Handle process termination and close the connection
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing the connection:', err.stack);
    }
    console.log('Database connection closed.');
    process.exit();
  });
});
