const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.get('/users', adminController.getAllUsers);

module.exports = router;
