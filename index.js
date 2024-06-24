const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const PORT = 3000;
const REPO_PATH = path.join(__dirname, 'repositorio.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/canciones', (req, res) => {
    try {
        const response = fs.readFileSync(REPO_PATH, 'utf8');
        const canciones = JSON.parse(response);
        res.status(200).json(canciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la información' });
    }
});

app.get('/canciones/:id', (req, res) => {
    const { id } = req.params;
    try {
        const response = fs.readFileSync(REPO_PATH, 'utf8');
        const canciones = JSON.parse(response);
        const cancion = canciones.find((c) => c.id == id);
        if (!cancion) {
            return res.status(404).json({ error: 'Canción no encontrada' });
        }
        res.status(200).json(cancion);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la información' });
    }
});

app.post('/canciones', (req, res) => {
    try {
        const { id, titulo, artista, tono } = req.body;
        if (!id || !titulo || !artista || !tono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const cancion = { id, titulo, artista, tono };
        const canciones = JSON.parse(fs.readFileSync(REPO_PATH, 'utf8'));
        canciones.push(cancion);
        fs.writeFileSync(REPO_PATH, JSON.stringify(canciones, null, 2));
        res.status(201).json({ message: 'Canción agregada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo crear la canción' });
    }
});

app.put('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, artista, tono } = req.body;
        if (!titulo || !artista || !tono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const canciones = JSON.parse(fs.readFileSync(REPO_PATH, 'utf8'));
        const index = canciones.findIndex((cancion) => cancion.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'La canción no existe' });
        }
        canciones[index] = { id, titulo, artista, tono };
        fs.writeFileSync(REPO_PATH, JSON.stringify(canciones, null, 2));
        res.status(200).json({ message: 'Canción actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo actualizar la canción' });
    }
});

app.delete('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        const canciones = JSON.parse(fs.readFileSync(REPO_PATH, 'utf8'));
        const index = canciones.findIndex((cancion) => cancion.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'La canción no existe, no puede ser eliminada' });
        }
        canciones.splice(index, 1);
        fs.writeFileSync(REPO_PATH, JSON.stringify(canciones, null, 2));
        res.status(200).json({ message: 'Canción eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo eliminar la canción' });
    }
});

app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));

