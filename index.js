const express = require('express');
const fs = require("fs");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
    try {
        const response = fs.readFileSync("repositorio.json");
        const canciones = JSON.parse(response);
        res.status(200).json(canciones);
    } catch (error) {
        res.status(404).send("Error al obtener la información");
    }
});

app.post("/canciones", (req, res) => {
    try {
        console.log(req.body);  
        const { id, titulo, artista, tono } = req.body;
        if (id == undefined || titulo == undefined || artista == undefined || tono == undefined) {
            throw new Error("Todos los campos son obligatorios");
        }
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync("repositorio.json"));
        canciones.push(cancion);
        fs.writeFileSync("repositorio.json", JSON.stringify(canciones, null, 2));
        res.status(200).json({ message: "Canción agregada con éxito" });
    } catch (error) {
        res.status(400).send(`No se pudo crear la canción: ${error.message}`);
    }
});

app.put("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params;
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync("repositorio.json"));
        const index = canciones.findIndex((cancion) => cancion.id == id);
        if (index === -1) {
            res.status(404).send("La canción no existe");
        } else {
            canciones[index] = cancion;
            fs.writeFileSync("repositorio.json", JSON.stringify(canciones, null, 2));
            res.status(200).json({ message: "Canción actualizada con éxito" });
        }
    } catch (error) {
        res.status(400).json({ message: `No se pudo actualizar la canción: ${error.message}` });
    }
});

app.delete("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params;
        const canciones = JSON.parse(fs.readFileSync("repositorio.json"));
        const index = canciones.findIndex((cancion) => cancion.id == id);
        if (index === -1) {
            res.status(404).send("La canción no existe, no puede ser eliminada");
        } else {
            canciones.splice(index, 1);
            fs.writeFileSync("repositorio.json", JSON.stringify(canciones, null, 2));
            res.status(200).json({ message: "Canción eliminada con éxito" });
        }
    } catch (error) {
        res.status(400).json({ message: `No se pudo eliminar la canción: ${error.message}` });
    }
});

app.listen(3000, () => console.log("Estoy funcionando"));
