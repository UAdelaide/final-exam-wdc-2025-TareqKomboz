const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth'); // session check

