// Importamos Express, el framework que nos permite crear el servidor backend
const express = require('express');

// Importamos CORS para permitir peticiones desde otro dominio/puerto (como Angular en localhost:4200)
const cors = require('cors');

// Creamos una app de Express
const app = express();

// Definimos el puerto donde se ejecutará el servidor
const PORT = 3000;

// Middleware que habilita CORS (necesario si frontend y backend están en puertos distintos)
app.use(cors());

// Middleware para que Express pueda leer cuerpos de tipo JSON en las peticiones
app.use(express.json());

// Array en memoria donde guardamos los ítems del moodboard (esto se reinicia si el servidor se apaga)
let moodboardItems = [];

/**
 * Ruta GET que devuelve todos los ítems del moodboard
 * Ejemplo: GET http://localhost:3000/api/items
 */
app.get('/api/items', (req, res) => {
  res.json(moodboardItems); // Respondemos con el array actual de ítems
});

/**
 * Ruta POST para agregar un nuevo ítem al moodboard
 * Ejemplo: POST http://localhost:3000/api/items con body JSON
 */
app.post('/api/items', (req, res) => {
  const newItem = req.body; // Leemos el nuevo ítem enviado desde el frontend

  // Validamos que el ítem tenga al menos 'type' y 'content'
  if (!newItem || !newItem.type || !newItem.content) {
    return res.status(400).json({ error: 'type y content son obligatorios' });
  }

  // Asignamos un ID único al nuevo ítem usando el timestamp actual
  newItem.id = Date.now();

  // Lo agregamos al array en memoria
  moodboardItems.push(newItem);

  // Devolvemos el nuevo ítem con un código 201 (creado)
  res.status(201).json(newItem);
});

// Iniciamos el servidor en el puerto definido y mostramos un mensaje en consola
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});
