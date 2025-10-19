const supabase = require('../supabaseClient');

// GET todos los items
async function getAllItems(req, res) {
  try {
    const { data, error } = await supabase
      .from('moodboard_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error en getAllItems:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Excepción en getAllItems:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// POST crear item
async function createItem(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // 1. Obtener usuario desde Supabase
    const { data, error: authError } = await supabase.auth.getUser(token);
    if (authError || !data?.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = data.user; // ✅ Aquí tienes el id del user
    console.log('Usuario autenticado:', user);

    // 2. Obtener rol del usuario desde tu tabla
    const { data: userData, error: userError } = await supabase
      .from('moodboard_users')
      .select('role')
      .eq('id', user.id)
      .select();

    if (userError) {
      console.error('Error al obtener rol del usuario:', userError);
      return res.status(500).json({ error: userError.message });
    }

    const userRole = userData?.role || 'user'; // fallback si no hay rol

    // 3. Datos del body
    const { type, subtype, title, content, status } = req.body;

    // 4. Insertar item con user.id y role
    const { data: insertedData, error: insertError } = await supabase
      .from('moodboard_items')
      .insert([{
        type,
        subtype,
        title,
        content,
        status,
        created_by: user.id,       // ✅ ID real del usuario
        creator_role: userData.role    // ✅ Rol real del usuario
      }])
      .select();

    if (insertError) {
      console.error('Error al insertar item:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json(insertedData);

  } catch (err) {
    console.error('Excepción en createItem:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// PUT actualizar item
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { type, subtype, title, content, status } = req.body;

    const { data, error } = await supabase
      .from('moodboard_items')
      .update({ type, subtype, title, content, status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error en updateItem:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Item actualizado correctamente:', data);
    res.json(data);
  } catch (err) {
    console.error('Excepción en updateItem:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// DELETE item
async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('moodboard_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error en deleteItem:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Item eliminado correctamente, id:', id);
    res.status(204).send();
  } catch (err) {
    console.error('Excepción en deleteItem:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
