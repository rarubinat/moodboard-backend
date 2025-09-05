const supabase = require('../supabaseClient');

// GET todos los items
async function getAllItems(req, res) {
  const { data, error } = await supabase
    .from('moodboard_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST crear item
async function createItem(req, res) {
  const { type, subtype, title, content, status } = req.body;
  const { data, error } = await supabase
    .from('moodboard_items')
    .insert([{ type, subtype, title, content, status }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

// PUT actualizar item
async function updateItem(req, res) {
  const { id } = req.params;
  const { type, subtype, title, content, status } = req.body;
  const { data, error } = await supabase
    .from('moodboard_items')
    .update({ type, subtype, title, content, status })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// DELETE item
async function deleteItem(req, res) {
  const { id } = req.params;
  const { error } = await supabase.from('moodboard_items').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
