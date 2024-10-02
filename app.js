const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));

let users = {};

// Servir archivos estáticos desde la carpeta "img"
app.use(express.static(path.join(__dirname, "img")));

// Ruta para la página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pagina.html"));
});

// Rutas para otros archivos HTML
app.get("/peliculas", (req, res) => {
    res.sendFile(path.join(__dirname, "peliculas.html"));
});

app.get("/series", (req, res) => {
    const email = req.session.email || ""; // Obtener el email de la sesión
    res.sendFile(path.join(__dirname, "series.html")); // Asegúrate que se llame series.html
});

app.get("/sobre", (req, res) => {
    res.sendFile(path.join(__dirname, "sobre.html"));
});

app.get("/extras", (req, res) => {
    res.sendFile(path.join(__dirname, "Extras.html"));
});

// Ruta para mostrar el formulario de registro
app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "registro.html"));
});

// Ruta para manejar el registro de usuario
app.post("/register", (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el usuario ya está registrado
    if (users[email]) {
        return res.send("El usuario ya está registrado. <a href='/registro'>Volver</a>");
    }

    // Guardar el usuario en la estructura de usuarios
    users[email] = { nombre, contraseña };
    req.session.email = email; // Guardar el email en la sesión
    res.redirect("/login");
});

// Ruta para mostrar el formulario de inicio de sesión (login)
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Ruta para manejar el inicio de sesión
app.post("/login", (req, res) => {
    const { email, contraseña } = req.body;

    // Verificar credenciales
    if (!users[email] || users[email].contraseña !== contraseña) {
        return res.send("Credenciales incorrectas. <a href='/login'>Volver</a>");
    }

    // Guardar el email en la sesión
    req.session.email = email;
    // Redirigir a la página de series si el login es exitoso
    res.redirect("/series");
});

// Ruta para manejar la selección de plan
app.post("/select-plan", (req, res) => {
    const email = req.body.email;
    const plan = req.body.plan;

    // Asegurarse de que se reciban los datos
    if (!email || !plan) {
        return res.status(400).json({ message: "Email o plan no definido" });
    }

    // Guardar la selección del plan en la sesión
    req.session.plan = plan;

    // Devolver respuesta con un mensaje
    res.json({ message: `Usted ha elegido el plan: ${plan}` });
});

// Ruta para manejar el pago
app.post("/pay", (req, res) => {
    const email = req.body.email;

    // Aquí puedes manejar la lógica para procesar el pago
    console.log(`Email: ${email} ha realizado un pago`);

    // Devolver un mensaje de pago exitoso
    res.json({ message: "Pago exitoso. Redirigiendo a la página de películas..." });
});

// Iniciar servidor en el puerto 3100
app.listen(3100, () => {
    console.log("Server running on port", 3100);
});
