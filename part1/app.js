var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Return a list of all dogs with their size and owner's username.
app.get("/api/dogs", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT d.name AS dog_name,
                    d.size,
                    u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch dogs." });
    }
});

// Return all open walk requests, including the dog name, requested time, location, and owner's username.
app.get("/api/walkrequests/open", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT w.request_id,
                    d.name AS dog_name,
                    w.requested_time,
                    w.duration_minutes,
                    w.location,
                    u.username AS owner_username
            FROM WalkRequests w
            JOIN Dogs d ON w.dog_id = d.dog_id
            JOIN Users u ON d.owner_id = u.user_id
            WHERE w.status = 'open'`
        );
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch walk requests." });
      }
});

// Route for avg rating and completed walks per walker
app.get("/api/walkers/summary", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT u.username         AS walker_username,
                    COUNT(r.rating_id) AS total_ratings,
                    AVG(r.rating)      AS average_rating,
                    COUNT(r.rating_id) AS completed_walks
            FROM Users u
            LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
            WHERE u.role = 'walker'
            GROUP BY u.user_id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch walker summary." });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
