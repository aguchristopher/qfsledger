const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/info', auth, userController.getUserInfo);
router.post('/resend-otp', auth, userController.resendOTP);
router.post('/verify-otp', userController.verifyOTP); // Remove auth middleware for initial verification
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/balance', auth, userController.getBalance);
router.get('/transactions', auth, userController.getTransactionHistory);
router.post('/balance', auth, userController.updateBalance);

module.exports = router;
