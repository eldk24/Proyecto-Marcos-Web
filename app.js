const express = require("express");
const path = require("path");

const app = express();

// Ruta para la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pagina.html"));
});

// Ruta para películas.html
app.get("/peliculas", (req, res) => {
    res.sendFile(path.join(__dirname, "peliculas.html"));
});

// Ruta para series.html
app.get("/series", (req, res) => {
    res.sendFile(path.join(__dirname, "series.html"));
});

// Ruta para sobre.html
app.get("/sobre", (req, res) => {
    res.sendFile(path.join(__dirname, "sobre.html"));
});

// Ruta para Extras.html
app.get("/extras", (req, res) => {
    res.sendFile(path.join(__dirname, "Extras.html"));
});

app.listen(3100, () => {
    console.log("Server running on port", 3100);
});


