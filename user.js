const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');// UUIDs are widely used in software development to uniquely
//  identify objects such as database records, sessions, or other entities.//v4 means version 4
const db = require('./db');  // Assuming you have a db connection file
const cookieParser = require('cookie-parser');

const router = express.Router();
const secretKey = 'yourSecretKey';  // Or use process.env.JWT_SECRET_KEY if using env variable

const app = express();
app.use(express.json());
app.use(cookieParser());  // To parse cookies

// Signup route
router.post('/signup', (req, res) => {
    const { email, password, username, phonenumber } = req.body;

    if (!email || !password || !username || !phonenumber) {
        return res.status(400).json({
            status: 'error',
            message: 'Username, Email, password, and phonenumber are required'
        });
    }

    db.query('SELECT * FROM usersignup WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.stack);
            return res.status(500).json({ status: 'error', message: 'Database query failed.' });
        }

        if (results.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'User already exists'
            });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err.stack);
                return res.status(500).json({
                    status: 'error',
                    message: 'Server error'
                });
            }

            db.query('INSERT INTO usersignup (id, email, password, username, phonenumber) VALUES (?, ?, ?, ?, ?)', 
            [uuidv4(), email, hash, username, phonenumber], (err) => {
                if (err) {
                    console.error('Error inserting user into database:', err.stack);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Server error'
                    });
                }

                res.status(201).json({
                    status: 'success',
                    message: 'User registered successfully',
                    data: {
                        email,
                        username,
                        phonenumber
                    }
                });
            });
        });
    });
});

// Login route
// Login route
router.post('/loginuser', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.',
      });
    }
  
    try {
      const userQuery = 'SELECT * FROM usersignup WHERE email = ?';
      db.query(userQuery, [email], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({
            status: 'error',
            message: 'Database query failed.',
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'User not found.',
          });
        }
  
        const user = results[0];
  
        // Compare password with bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing password:', err);
            return res.status(500).json({
              status: 'error',
              message: 'Password comparison failed.',
            });
          }
  
          if (!isMatch) {
            return res.status(401).json({
              status: 'error',
              message: 'Invalid credentials.',
            });
          }
  
          // Generate JWT token
          const token = jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: '1h' }
          );
  
          res.status(200).json({
            status: 'success',
            token: token,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
            },
          });
        });
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server error.',
      });
    }
  });
  
// Profile route (protected by verifyToken middleware)
router.get('/profile/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
  
    try {
      const [userDetails] = await db.promise().query('SELECT id, username, email, phonenumber FROM usersignup WHERE id = ?', [userId]);
      const [confirmedBookings] = await db.promise().query('SELECT * FROM confirmedbookings WHERE usersignupid = ?', [userId]);
      const [draftBookings] = await db.promise().query('SELECT * FROM draftbookings WHERE usersignupid = ?', [userId]);
  
      if (userDetails.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        userDetails: userDetails[0],
        confirmedBookings,
        draftBookings,
      });
    } catch (err) {
      console.error('Error fetching profile data:', err.stack);
      res.status(500).json({ message: 'Failed to fetch profile data.', error: err.message });
    }
  });

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(403); // Forbidden: No token
    }

    jwt.verify(token, secretKey, (err, authData) => {
        if (err) {
            return res.sendStatus(403); // Forbidden: Invalid token
        }
        req.authData = authData; // Attach the authData to the request object
        next();
    });
}

module.exports = router;
