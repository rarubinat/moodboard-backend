require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a PostgreSQL usando la variable de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necesario para Supabase
});

app.use(cors());
app.use(express.json());

/**
 * GET /api/items
 * Devuelve todos los ítems del moodboard desde la base de datos
 */
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM moodboard_items ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ítems:', error);
    res.status(500).json({ error: 'Error al obtener los ítems' });
  }
});

/**
 * POST /api/items
 * Agrega un nuevo ítem al moodboard en la base de datos
 */
app.post('/api/items', async (req, res) => {
  const { type, content } = req.body;

  if (!type || !content) {
    return res.status(400).json({ error: 'type y content son obligatorios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO moodboard_items (type, content) VALUES ($1, $2) RETURNING *',
      [type, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar ítem:', error);
    res.status(500).json({ error: 'Error al agregar el ítem' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});
