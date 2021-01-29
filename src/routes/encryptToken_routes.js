'use strict';
const express = require('express');
const router = express.Router();
const encryptTokenController = require('../controllers/encryptToken_controllers');

// Metodo para generar y encriptar token
router.post('/token/encrypt', encryptTokenController.token);

module.exports = router;
