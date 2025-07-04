const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/dogs/mine all dogs for the logged-in owner
router.get('/mine', async (req, res) => {
    try {
      const [rows] = await db.execute(
        `SELECT dog_id, name
           FROM Dogs
          WHERE owner_id = ?`,
        [req.session.user.id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'DB error' });
    }
});

// Route to list every dog with size and owner username
router.get("/", async (req, res) => {
  try {
      const [rows] = await db.query(
          `SELECT *
          FROM Dogs`
      );
      res.json(rows);
  } catch (err) {
      res.status(500).json({ error: "Failed to fetch dogs." });
  }
});

module.exports = router;
