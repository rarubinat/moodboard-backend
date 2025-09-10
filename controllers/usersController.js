const supabase = require('../supabaseClient');

/** -----------------------------
 * Obtener todos los usuarios (sin contraseñas)
 * GET /api/users
 * -----------------------------
 */
async function getUsers(req, res) {
  try {
    const { data, error } = await supabase
      .from('moodboard_users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getUsers error:', error);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    res.json(data);
  } catch (err) {
    console.error('Unexpected getUsers error:', err);
    res.status(500).json({ error: 'Error inesperado al obtener usuarios' });
  }
}

/** -----------------------------
 * Crear un nuevo usuario (registro)
 * POST /api/users/register
 * -----------------------------
 */
async function createUser(req, res) {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Supabase Auth error:', authError);
      return res.status(500).json({ error: 'No se pudo crear el usuario en Auth' });
    }

    const userId = authData.user.id;

    const { data, error } = await supabase
      .from('moodboard_users')
      .insert([{ id: userId, email, name, role }])
      .select()
      .single();

    if (error) {
      console.error('Supabase DB insert error:', error);
      return res.status(500).json({ error: 'No se pudo guardar la información del usuario' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected createUser error:', err);
    res.status(500).json({ error: 'Error inesperado al crear usuario' });
  }
}

/** -----------------------------
 * Login (devuelve usuario + token)
 * POST /api/users/login
 * -----------------------------
 */
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios' });
  }

  try {
    // 🔹 Autenticar usuario en Supabase
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !sessionData.user) {
      console.error('Supabase login error:', loginError);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const authUser = sessionData.user;

    // 🔹 Obtener info adicional de moodboard_users
    const { data: appUser } = await supabase
      .from('moodboard_users')
      .select('id, email, name, role')
      .eq('id', authUser.id)
      .single()
      .catch(() => null);

    // 🔹 Devolver usuario + token
    res.json({
      user: appUser || { id: authUser.id, email: authUser.email },
      accessToken: sessionData.session.access_token,
    });
  } catch (err) {
    console.error('Unexpected loginUser error:', err);
    res.status(500).json({ error: 'Error inesperado al autenticar usuario' });
  }
}

module.exports = {
  getUsers,
  createUser,
  loginUser,
};
