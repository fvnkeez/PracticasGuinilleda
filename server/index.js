import express from 'express';
import mysql from 'mysql2/promise'; // Versión con promesas
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración MySQL
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password1234',
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});