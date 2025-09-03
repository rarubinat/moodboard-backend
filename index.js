require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || "*"
}));
app.use(express.json());

// GET todos
app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase
    .from('moodboard_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST crear nuevo
app.post('/api/items', async (req, res) => {
  const { type, subtype, title, content, status } = req.body;
  const { data, error } = await supabase
    .from('moodboard_items')
    .insert([{ type, subtype, title, content, status }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT actualizar
app.put('/api/items/:id', async (req, res) => {
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
});

// DELETE eliminar
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('moodboard_items').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
