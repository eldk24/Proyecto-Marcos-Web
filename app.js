const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "img"))); // Servir archivos estáticos
app.use(express.static("public")); // Para servir otros archivos estáticos si es necesario

// Configuración de sesiones
app.use(session({
    secret: "miSecreto",
    resave: false,
    saveUninitialized: true
}));

const upload = multer({ dest: 'img/' }); // Configuración de multer para la subida de imágenes

let users = {};
let plans = {};

// Ruta para la página principal
app.get("/", (req, res) => {
    res.render("pagina"); // Renderizar la vista pagina.ejs
});

// Rutas para otros archivos EJS
app.get("/peliculas", (req, res) => {
    res.render("peliculas"); // Renderizar la vista peliculas.ejs
});

// Ruta para la página de series
app.get("/series", (req, res) => {
    const email = req.session.email; // Obtén el email de la sesión
    res.render("series", { email }); // Pasa el email a la vista
});


app.get("/sobre", (req, res) => {
    res.render("sobre"); // Renderizar la vista sobre.ejs
});

app.get("/extras", (req, res) => {
    res.render("Extras"); // Renderizar la vista Extras.ejs
});

// Ruta para mostrar el formulario de registro
app.get("/registro", (req, res) => {
    res.render("registro"); // Renderizar la vista registro.ejs
});

// Ruta para manejar el registro de usuario
app.post("/register", (req, res) => {
    const { nombre, email, contraseña } = req.body;

    if (users[email]) {
        return res.send("El usuario ya está registrado. <a href='/registro'>Volver</a>");
    }

    users[email] = { nombre, contraseña };
    res.redirect("/login");
});

// Ruta para mostrar el formulario de inicio de sesión
app.get("/login", (req, res) => {
    res.render("login"); // Renderizar la vista login.ejs
});

// Ruta para manejar el inicio de sesión
app.post("/login", (req, res) => {
    const { email, contraseña } = req.body;

    if (!users[email] || users[email].contraseña !== contraseña) {
        return res.send("Credenciales incorrectas. <a href='/login'>Volver</a>");
    }

    req.session.email = email;

    if (plans[email]) {
        return res.redirect("/peliculas");
    } else {
        res.redirect("/series");
    }
});

// Ruta para seleccionar el plan
app.post("/select-plan", (req, res) => {
    const { email, plan } = req.body;

    if (!email || !plan) {
        return res.status(400).json({ message: "Datos faltantes" });
    }

    plans[email] = plan;
    res.json({ message: `Usted ha elegido el plan ${plan}`, plan, email });
});

// Ruta para manejar el pago
app.post("/pay", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Falta el email" });
    }

    console.log(`Email: ${email} ha seleccionado un plan.`);

    res.json({ message: "Pago exitoso" });
});

// Ruta para mostrar el perfil del usuario
app.get("/perfil", (req, res) => {
    const email = req.session.email;

    if (!email) {
        return res.redirect("/login");
    }

    const user = users[email];
    const plan = plans[email];

    res.render("perfil", {
        nombre: user.nombre,
        email: email,
        plan: plan || "No seleccionado" // Si no hay plan, mostrar "No seleccionado"
    });
});

// Ruta para manejar la subida de la foto de perfil
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se subió ninguna imagen." });
    }

    const newFileName = `${req.session.email}.jpg`;
    const oldPath = path.join(__dirname, 'img', req.file.filename);
    const newPath = path.join(__dirname, 'img', newFileName);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error al renombrar la imagen." });
        }
        res.json({ message: "Imagen subida exitosamente.", filename: newFileName });
    });
});

// Ruta para cerrar sesión
app.get("/cerrar", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error al cerrar sesión");
        }

        res.send(`
            <script>
                alert("Sesión cerrada con éxito.");
                window.location.href = "/";
            </script>
        `);
    });
});

// Iniciar servidor en el puerto 3100
app.listen(3100, () => {
    console.log("Server running on port", 3100);
});
