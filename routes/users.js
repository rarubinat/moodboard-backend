const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser
} = require('../controllers/usersController');

// GET todos los usuarios
router.get('/', getUsers);

// POST registrar nuevo usuario
router.post('/', createUser);

module.exports = router;
