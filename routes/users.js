const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser
} = require('../controllers/usersController');

// GET todos los usuarios (solo metadata, no passwords)
router.get('/', getUsers);

// POST registrar nuevo usuario (crea en Auth + moodboard_users)
router.post('/register', createUser);

// POST login de usuario (devuelve token + metadata)
router.post('/login', loginUser);

module.exports = router;