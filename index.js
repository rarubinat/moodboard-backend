require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// Configuración de CORS
// -----------------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: function(origin, callback) {
    // Permite solicitudes sin origen (Postman, servidores)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS no permitido para origen: ${origin}`));
    }
  }
}));

// -----------------------------
// Middlewares
// -----------------------------
app.use(express.json());

// -----------------------------
// Rutas
// -----------------------------
app.use('/api/items', require('./routes/items'));
app.use('/api/users', require('./routes/users'));

// -----------------------------
// Iniciar servidor
// -----------------------------
app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
