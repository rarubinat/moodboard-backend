const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.registerUser);
router.get('/', usersController.getAllUsers);

module.exports = router;
