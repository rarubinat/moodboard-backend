const supabase = require('../supabaseClient');
const bcrypt = require('bcrypt');

// POST registrar usuario
async function registerUser(req, res) {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

  try {
    const hashed_password = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('moodboard_users')
      .insert([{ email, hashed_password, name, role }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET todos los usuarios
async function getAllUsers(req, res) {
  const { data, error } = await supabase.from('moodboard_users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

module.exports = {
  registerUser,
  getAllUsers,
};
