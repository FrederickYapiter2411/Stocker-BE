const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Izinkan dari React
}));
app.use(express.json());

// Database
const db = new sqlite3.Database('inventory.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            kategori TEXT NOT NULL,
            stok INTEGER NOT NULL,
            harga INTEGER NOT NULL,
            deskripsi TEXT
        )
    `);
});

// Routes

app.get('/api/items', (req, res) => {
    const sql = 'SELECT * FROM items ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM items WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Barang tidak ditemukan' });
            return;
        }
        res.json(row);
    });
});

app.post('/api/items', (req, res) => {
    const { nama, kategori, stok, harga, deskripsi } = req.body;
    if (!nama || !kategori || typeof stok !== 'number' || typeof harga !== 'number') {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const sql = 'INSERT INTO items (nama, kategori, stok, harga, deskripsi) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [nama, kategori, stok, harga, deskripsi || ''], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

app.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { nama, kategori, stok, harga, deskripsi } = req.body;

    if (!id || !nama) {
        return res.status(400).json({ error: 'ID dan nama diperlukan' });
    }

    const sql = 'UPDATE items SET nama = ?, kategori = ?, stok = ?, harga = ?, deskripsi = ? WHERE id = ?';
    db.run(sql, [nama, kategori, stok, harga, deskripsi || '', id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Barang tidak ditemukan' });
        } else {
            res.json({ success: true });
        }
    });
});

app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM items WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Barang tidak ditemukan' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});