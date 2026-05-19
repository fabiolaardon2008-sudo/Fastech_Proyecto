// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu conexión a MySQL aquí
const db = mysql.createConnection({
    host: 'localhost',
    user: 'fastech_user',      // Tu usuario de MySQL
    password: 'fabiola2008',      // Tu contraseña de MySQL
    database: 'fastech_db'
});

// Ruta para obtener productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Ruta para agregar un producto
app.post('/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', 
    [nombre, precio, stock], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));