import express from 'express';
import db from './src/db.js';

const router = express.Router();

// Routes

router.get('/api/items', (req, res) => {
    const sql = 'SELECT * FROM items ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM items WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Barang tidak ditemukan' });
        res.json(row);
    });
});

router.post('/api/items', (req, res) => {
    const { name, quantity, description } = req.body;
    if (!name || typeof quantity !== 'number') {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const sql = 'INSERT INTO items (name, quantity, description) VALUES (?, ?, ?)';
    db.run(sql, [name, quantity, description || ''], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

router.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { name, quantity, description } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: 'ID dan nama diperlukan' });
    }

    const sql = 'UPDATE items SET name = ?, quantity = ?, description = ? WHERE id = ?';
    db.run(sql, [name, quantity, description || '', id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
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
    db.run(sql, [id], function (err) { // ✅ diperbaiki di sini
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
            res.status(404).json({ error: 'Barang tidak ditemukan' });
        } else {
            res.json({ success: true });
        }
    });
});

export default router;
