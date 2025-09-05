const supabase = require('../supabaseClient');

// -----------------------------
// Obtener todos los usuarios (sin contraseñas)
// -----------------------------
async function getUsers(req, res) {
  try {
    const { data, error } = await supabase
      .from('moodboard_users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error getUsers:', err);
    res.status(500).json({ error: err.message });
  }
}

// -----------------------------
// Crear un nuevo usuario (registro)
// -----------------------------
async function createUser(req, res) {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios' });
  }

  try {
    console.log('📩 POST /api/users ->', req.body);

    // 1️⃣ Crear usuario en Supabase Auth (admin)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // <- evita necesidad de confirmación
    });

    if (authError) throw authError;
    if (!authData?.user) throw new Error('No se pudo crear el usuario en Supabase Auth');

    const userId = authData.user.id;
    console.log('✅ Usuario creado en Auth con ID:', userId);

    // 2️⃣ Crear fila en moodboard_users con info adicional
    const { data, error } = await supabase
      .from('moodboard_users')
      .insert([{ id: userId, email, name, role }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Usuario insertado en moodboard_users:', data);

    res.status(201).json(data);
  } catch (err) {
    console.error('Error createUser:', err);
    res.status(500).json({ error: err.message });
  }
}

// -----------------------------
// Login (devuelve usuario + token)
// -----------------------------
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios' });
  }

  try {
    // 1️⃣ Autenticar con Supabase Auth
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) return res.status(401).json({ error: loginError.message });

    const userId = sessionData.user.id;

    // 2️⃣ Obtener info adicional de moodboard_users
    const { data: appUser, error: userError } = await supabase
      .from('moodboard_users')
      .select('id, email, name, role')
      .eq('id', userId)  // 
      .single();
    if (userError) throw userError;

    // 3️⃣ Devolver usuario + token de Supabase
    res.json({
      user: appUser,
      accessToken: sessionData.session.access_token,
    });
  } catch (err) {
    console.error('Error loginUser:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUsers,
  createUser,
  loginUser,
};
