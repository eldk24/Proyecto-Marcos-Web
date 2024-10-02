const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "img"))); // Servir archivos estáticos

app.set("view engine", "ejs");

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
    res.sendFile(path.join(__dirname, "pagina.html"));
});

// Rutas para otros archivos HTML
app.get("/peliculas", (req, res) => {
    res.sendFile(path.join(__dirname, "peliculas.html"));
});

app.get("/series", (req, res) => {
    res.sendFile(path.join(__dirname, "series.html"));
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

app.get("/perfil", (req, res) => {
    res.sendFile(path.join(__dirname, "perfil.html"));
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
    res.sendFile(path.join(__dirname, "login.html"));
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
    res.json({ message: `Usted ha elegido el plan ${plan}`, plan, email }); // Asegúrate de enviar el email aquí
});

// Ruta para manejar el pago
app.post("/pay", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Falta el email" });
    }

    console.log(`Email: ${email} ha realizado un pago`);

    res.json({ message: "Pago exitoso" });
});

// Ruta para mostrar el perfil del usuario
app.get("/perfil", (req, res) => {
    const email = req.session.email; // Obtiene el email de la sesión
    const user = users[email]; // Obtiene el usuario usando el email

    if (!user) {
        return res.redirect("/login"); // Redirige a login si no hay usuario
    }

    res.render("perfil", { nombre: user.nombre, email: email }); // Pasa el nombre y el email a la plantilla
});

// Ruta para manejar la subida de la foto de perfil
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.send("No se subió ninguna imagen.");
    }

    // Aquí puedes guardar la información del archivo o actualizar el perfil
    res.send(`Imagen subida: ${req.file.filename}`);
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
