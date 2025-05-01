const express = require('express');
const { updateUserProfile, getUserProfile } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.put('/profile', authenticate, updateUserProfile);
router.get('/profile', authenticate, getUserProfile);

module.exports = router;
