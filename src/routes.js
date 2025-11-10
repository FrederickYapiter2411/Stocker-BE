import express from 'express';
import db from './db.js';

const router = express.Router();

// Routes

router.get('/api/items', (req, res) => {
    const sql = 'SELECT * FROM items ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

router.get('/api/items/:id', (req, res) => {
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

router.post('/api/items', (req, res) => {
    const { name, kategori, quantity, harga, deskripsi } = req.body;
    console.log(req.body);
    if (!name || !kategori || typeof quantity !== 'number' || typeof harga !== 'number') {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const sql = 'INSERT INTO items (nama, kategori, stok, harga, deskripsi) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [name, kategori, quantity, harga, deskripsi || ''], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, id: this.lastID });
    });
});

router.put('/api/items/:id', (req, res) => {
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

router.delete('/api/items/:id', (req, res) => {
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

export default router;
