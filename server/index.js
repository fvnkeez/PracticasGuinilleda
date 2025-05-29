import express from 'express';
import mysql from 'mysql2/promise'; // Versión con promesas
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // o el puerto de tu aplicación Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Configuración MySQL
const db = await mysql.createConnection({
  host: '192.168.1.229',
  user: 'Dani',
  password: 'Dani1234',
  database: 'mibbddvue'
});

// Rutas
app.get('/api/datos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/datos', async (req, res) => {
  const { nombre, valor } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, valor) VALUES (?, ?)',
      [nombre, valor]
    );
    res.json({ id: result.insertId, nombre, valor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Servidor en http://192.168.1.229:${PORT}`);
});