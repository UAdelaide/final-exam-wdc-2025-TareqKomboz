const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET /api/dogs all dogs for the logged-in owner
router.get('/', async (req, res) => {
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

module.exports = router;
