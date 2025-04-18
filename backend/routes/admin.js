const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

router.get('/users', adminController.getAllUsers);
router.post('/users/:userId/fund', adminController.fundUser);
router.post('/users/:userId/update-coins', adminController.updateUserCoins);

module.exports = router;
