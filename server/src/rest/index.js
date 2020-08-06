const express = require('express');
const cors = require('cors');
const Errors = require('./errors');
const Users = require('./users');
const Games = require('./games');

const api = express();
const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// Routes
router.get('/ping', (req, res) => res.sendStatus(200));
router.use('/users', Users.router);
router.use('/games', Games.router);

// Error Middleware
router.use(Errors.middleware);

api.use('/api', router);
module.exports = api;