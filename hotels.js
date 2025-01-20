const express = require('express');
const mysql = require('mysql2');

const path = require('path');//this is for routing
const router = express.Router();


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Priya@123',
    database: 'hotelmanagementsystem'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Serve images statically from the "images" directory
router.use('/images', express.static(path.join(__dirname, 'images')));

// Get all hotels
router.get('/', (req, res) => {
    const sql = 'SELECT hotelid, hotelname, hotellocation, imageurl, type, price, hotelratings FROM hotels';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching hotels.');
        }

        // Fix the image URL construction
        const baseUrl = `${req.protocol}://${req.get('host')}/images/`; // The base URL to access images

        const hotelsWithImages = results.map(hotel => {
            // Ensure we only prepend "images/" once and handle cases where it's already there
            let imageUrl = hotel.imageurl;

            // Remove any leading ./ or / from the image path to avoid double `/images/`
            imageUrl = imageUrl.replace(/^(\.\/|\/)/, ''); 

            // Now append "images/" only if it is not already at the start
            if (!imageUrl.startsWith('images/')) {
                imageUrl = 'images/' + imageUrl;
            }

            return {
                ...hotel,
                imageurl: baseUrl + imageUrl // Construct the full URL correctly
            };
        });

        res.json(hotelsWithImages);
    });
});

//it gives details of single id ,eg=pune so pune ki ids pe jo hotels hai wo dega 
router.get('/:id', (req, res) => {
    console.log(`Fetching hotel with id: ${req.params.id}`); // Add a log for debugging
    const sql = 'SELECT hotelid, hotelname, hotellocation, imageurl, type, price, hotelratings FROM hotels WHERE hotelid = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).send('An error occurred while fetching the hotel.');
        }

        if (results.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}/images/`;
            const hotelWithImage = {
                ...results[0],
                imageurl: baseUrl + results[0].imageurl
            };
            res.json(hotelWithImage);
        } else {
            res.status(404).send('Hotel not found.');
        }
    });
});


// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
module.exports = router; // Ensure this line is present
