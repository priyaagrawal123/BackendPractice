const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Replace with your MySQL username
    password: 'Priya@123',           // Replace with your MySQL password
    database: 'hotelmanagementsystem' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
