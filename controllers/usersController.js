const supabase = require('../supabaseClient');

// Obtener todos los usuarios
async function getUsers(req, res) {
  const { data, error } = await supabase
    .from('moodboard_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// Crear un nuevo usuario
async function createUser(req, res) {
  const { email, name, role } = req.body;

  const { data, error } = await supabase
    .from('moodboard_users')
    .insert([{ email, name, role }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

module.exports = {
  getUsers,
  createUser,
};
