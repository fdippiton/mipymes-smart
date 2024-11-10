const express = require("express");
const config = require("../config");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

// Models
const Clientes = require("./models/Clientes");
const Administradores = require("./models/Administradores");
const Asesores = require("./models/Asesores");
const Asesorias = require("./models/Asesorias");
const DocAsesorias = require("./models/DocAsesorias");
const Talleres = require("./models/Talleres");
const Roles = require("./models/Roles");

const app = express();
const PORT = config.SERVER_PORT || 3000;
const secretKey = config.SECRET_KEY;
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

// Connect database
mongoose.connect(config.database.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Conectado a la base de datos de MongoDB");
});
mongoose.connection.on("error", (error) => {
  console.error("Error al conectar a MongoDB:", error);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* -------------------------------------------------------------------------- */
/*                              Register new user                             */
/* -------------------------------------------------------------------------- */
app.post("/registrar", async (req, res) => {
  const {
    nombre,
    email_cliente,
    contrasena,
    email_empresa,
    nombre_empresa,
    telefono,
    rubro,
    descripcion_servicios,
    selectedOptionConocio_CMU,
    selectedOptionIngresos,
    selectedOptionsIServiciosNecesarios,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Buscar el rol de "Cliente"
    const roleDoc = await Roles.findOne({ descripcion: "Cliente" });
    console.log(roleDoc);
    if (!roleDoc) {
      return res.status(400).json({
        error:
          "Rol 'cliente' no encontrado. Asegúrate de que el rol exista en la colección 'roles'.",
      });
    }

    // Crear el cliente con el rol asignado
    const userDoc = await Clientes.create({
      nombre,
      contrasena: hashedPassword,
      nombre_empresa,
      contacto: {
        email_cliente,
        email_empresa,
        telefono,
      },
      rubro,
      descripcion_servicios,
      servicios_requeridos: selectedOptionsIServiciosNecesarios,
      conocio_CMU: selectedOptionConocio_CMU,
      ingresos: selectedOptionIngresos,
      rol: roleDoc._id,
    });

    res.status(200).json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario." });
  }
});

app.post("/login", async (req, res) => {
  // destructure request body for username and password
  const { email_cliente, contrasena } = req.body;

  // find user in database
  const userDoc = await Clientes.findOne({
    "contacto.email_cliente": email_cliente,
  });

  // console.log(userDoc);

  // check if user exists
  if (!userDoc) {
    // respond with error if user doesn't exist
    return res.status(401).json({ error: "Credenciales inválidas." });
  } else {
    // compare password from request body with password from database
    const passwordMatch = await bcrypt.compare(contrasena, userDoc.contrasena);

    // check if passwords match
    if (!passwordMatch) {
      // respond with error if passwords don't match
      return res.status(401).json({ error: "Credenciales inválidas." });
    } else {
      // res.json(userDoc);

      try {
        // generate and sign json web token
        jwt.sign(
          { email_cliente, id: userDoc._id },
          secretKey,
          {},
          (err, token) => {
            if (err) throw err;
            // set cookie with token and send user details in response
            res.cookie("token", token).json({
              id: userDoc._id,
              email_cliente,
            });
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.get("/profile", (req, res) => {
  // Get token from cookies
  const { token } = req.cookies;

  // Verify token with secret key
  jwt.verify(token, secretKey, {}, (err, info) => {
    // Check for error and throw it
    if (err) throw err;
    // Send user information as JSON
    res.json(info);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
