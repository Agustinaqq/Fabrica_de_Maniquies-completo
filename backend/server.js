const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'fabrica_maniquies'
});

app.get('/maniquies', async (req, res) => {
  try {
    const querySQL = `
      SELECT 
        m.id_maniqui, 
        m.nombre_modelo, 
        m.estado,
        IFNULL(GROUP_CONCAT(DISTINCT mat.nombre SEPARATOR ', '), 'Sin piezas') AS materiales,
        IFNULL(GROUP_CONCAT(DISTINCT col.nombre SEPARATOR ', '), 'Sin piezas') AS colores
      FROM maniquies m
      LEFT JOIN piezas p ON m.id_maniqui = p.id_maniqui
      LEFT JOIN materiales mat ON p.material_id = mat.id_material
      LEFT JOIN colores col ON p.color_id = col.id_color
      GROUP BY m.id_maniqui;
    `;
    const [filas] = await db.query(querySQL);
    res.status(200).json(filas);
  } catch (error) {
    console.error('Error en MySQL:', error.message);
    res.status(500).json({ error: 'Error al obtener datos', detalle: error.message });
  }
});

app.post('/maniquies', async (req, res) => {
  const { nombre_modelo, estado, material, color } = req.body;
  try {

    const [resultadoManiqui] = await db.query(
      'INSERT INTO maniquies (nombre_modelo, estado) VALUES (?, ?)',
      [nombre_modelo, estado]
    );
    const idNuevoManiqui = resultadoManiqui.insertId;

    const [[resMat]] = await db.query('SELECT id_material FROM materiales WHERE nombre = ? LIMIT 1', [material]);
    const [[resCol]] = await db.query('SELECT id_color FROM colores WHERE nombre = ? LIMIT 1', [color]);

    const idMaterial = resMat ? resMat.id_material : 1;
    const idColor = resCol ? resCol.id_color : 1;      

    await db.query(
      'INSERT INTO piezas (tipo_pieza_id, material_id, color_id, id_maniqui, talle, fecha_fabricacion) VALUES (?, ?, ?, ?, ?, CURDATE())',
      [2, idMaterial, idColor, idNuevoManiqui, 'Mediano']
    );

    res.status(201).json({ mensaje: 'Maniquí y pieza creados con éxito', id: idNuevoManiqui });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear', detalle: error.message });
  }
});

app.put('/maniquies/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_modelo, estado, material, color } = req.body;
  try {

    await db.query(
      'UPDATE maniquies SET nombre_modelo = ?, estado = ? WHERE id_maniqui = ?',
      [nombre_modelo, estado, id]
    );

    const [[resMat]] = await db.query('SELECT id_material FROM materiales WHERE nombre = ? LIMIT 1', [material]);
    const [[resCol]] = await db.query('SELECT id_color FROM colores WHERE nombre = ? LIMIT 1', [color]);

    if (resMat && resCol) {
      await db.query(
        'UPDATE piezas SET material_id = ?, color_id = ? WHERE id_maniqui = ?',
        [resMat.id_material, resCol.id_color, id]
      );
    }

    res.status(200).json({ mensaje: 'Maniquí y sus piezas actualizados con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar', detalle: error.message });
  }
});

app.delete('/maniquies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM piezas WHERE id_maniqui = ?', [id]);
    // Luego borramos el maniquí
    await db.query('DELETE FROM maniquies WHERE id_maniqui = ?', [id]);
    res.status(200).json({ mensaje: 'Maniquí eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar', detalle: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});