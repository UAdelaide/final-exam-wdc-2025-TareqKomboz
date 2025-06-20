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
    await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    const pool = mysql.createPool(db);

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Route to list every dog with size and owner username
app.get("/api/dogs", async (req, res) => {
  try {
    const [rows] = await pool.query(
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

// Route to get all open walk requests with dog and owner username
app.get("/api/walkrequests/open", async (req, res) => {
    try {
        const [rows] = await pool.query();
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch walk requests." });
      }
    });

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;