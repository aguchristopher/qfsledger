const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.get('/users', adminAuth, adminController.getAllUsers);

module.exports = router;
