const express = require("express");
const config = require("../config");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
// const Cookies = require("js-cookie");

// Models
const Clientes = require("./models/Clientes");
const Administradores = require("./models/Administradores");
const Asesores = require("./models/Asesores");
const Asesorias = require("./models/Asesorias");
const DocAsesorias = require("./models/DocAsesorias");
const Talleres = require("./models/Talleres");
const Roles = require("./models/Roles");
const Estados = require("./models/Estados");
const Asignaciones = require("./models/Asignaciones");

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
  const { email, contrasena } = req.body;

  // find user in database
  try {
    let userDoc = null;
    // Primero busca en la colección Clientes
    userDoc = await Clientes.findOne({
      "contacto.email_cliente": email,
    });

    // Si no encuentra en Clientes, busca en Administradores
    if (!userDoc) {
      userDoc = await Administradores.findOne({
        "contacto.email_admin": email,
      });
    }

    // Si no encuentra en Administradores, busca en Asesores (si tienes esta colección)
    if (!userDoc) {
      userDoc = await Asesores.findOne({
        "contacto.email": email,
      });
    }

    // check if user exists
    if (!userDoc) {
      // respond with error if user doesn't exist
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

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
        jwt.sign({ email, id: userDoc._id }, secretKey, {}, (err, token) => {
          if (err) throw err;
          // set cookie with token and send user details in response
          res.cookie("token", token).json({
            id: userDoc._id,
            email,
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Error buscando el email:", error);
    throw new Error("Hubo un error al realizar la búsqueda");
  }
  // console.log(userDoc);
});

app.get("/userInfo", async (req, res) => {
  // Get token from cookies
  // const token = Cookies.get("token");
  const token = await req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    // Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, secretKey);

    let userDoc = null;
    // Primero busca en la colección Clientes
    userDoc = await Clientes.findById({ _id: decoded.id })
      .populate("rol")
      .populate("estado");

    // Si no encuentra en Clientes, busca en Administradores
    if (!userDoc) {
      userDoc = await Administradores.findById({ _id: decoded.id }).populate(
        "rol"
      );
    }

    // Si no encuentra en Administradores, busca en Asesores (si tienes esta colección)
    if (!userDoc) {
      userDoc = await Asesores.findById({ _id: decoded.id }).populate("rol");
    }

    if (userDoc) {
      res.json(userDoc); // Enviamos la información del usuario
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

// app.post("/logout", (req, res) => {
//   // Remove token from cookies
//   res.clearCookie("token").json({ message: "Logged out successfully" });
// });

app.get("/getAllClientes", async (req, res) => {
  try {
    const clients = await Clientes.find().populate("estado"); // Assuming Clients is a model for the clients collection
    res.json(clients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allEstados", async (req, res) => {
  try {
    const estados = await Estados.find();
    res.json(estados);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateEstadoCliente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // El nuevo estado debe estar en el cuerpo de la solicitud

    const updatedClient = await Clientes.findByIdAndUpdate(
      id,
      { estado }, // Actualiza el campo estado
      { new: true } // Devuelve el cliente actualizado
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(updatedClient);
  } catch (error) {
    console.error("Error en la actualización del estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/registrarAsesor", async (req, res) => {
  const { nombre, contrasena, email, telefono, especialidades, meta } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Buscar el rol de "Cliente"
    const roleDoc = await Roles.findOne({ descripcion: "Asesor" });
    console.log(roleDoc);
    if (!roleDoc) {
      return res.status(400).json({
        error:
          "Rol 'Asesor' no encontrado. Asegúrate de que el rol exista en la colección 'roles'.",
      });
    }

    // Crear el cliente con el rol asignado
    const userDoc = await Asesores.create({
      nombre,
      contrasena: hashedPassword,
      contacto: {
        email,
        telefono,
      },
      especialidades,
      max_clientes: meta, // Inicialmente, no tiene clientes asociados
      rol: roleDoc._id,
    });

    res.status(200).json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario asesor." });
  }
});

app.get("/getAllAsesores", async (req, res) => {
  try {
    const asesores = await Asesores.find(); // Assuming Clients is a model for the clients collection
    res.json(asesores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllAsignaciones", async (req, res) => {
  try {
    const asignaciones = await Asignaciones.find()
      .populate("cliente_id") // Cambiado para hacer `populate` del campo `cliente_id`
      .populate("asesor_id"); // Cambiado para hacer `populate` del campo `asesor_id`
    res.json(asignaciones);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/asignarClienteAAsesor", async (req, res) => {
  const { clienteId, asesorId } = req.body;

  // console.log("data recieved", clienteId, asesorId);

  try {
    // Asignar el cliente al asesor
    const asesor = await Asesores.findById(asesorId);
    const cliente = await Clientes.findById(clienteId);

    // console.log("data recieved", asesor, cliente);
    // Verificar que el asesor y el cliente existen
    if (!asesor || !cliente) {
      return res.status(404).json({ error: "Asesor o cliente no encontrado" });
    }

    // Verificar si el cliente ya está asignado al asesor
    if (asesor.clientes_asignados.includes(clienteId)) {
      return res
        .status(400)
        .json({ error: "El cliente ya está asignado a este asesor" });
    }

    // Verificar si el cliente ya tiene una asignación en la colección Asignaciones
    const asignacionExistente = await Asignaciones.findOne({
      cliente_id: clienteId,
    });

    if (asignacionExistente) {
      return res
        .status(400)
        .json({ error: "El cliente ya tiene una asignación con otro asesor." });
    }

    // Verificar si el asesor ha alcanzado su límite de clientes
    if (asesor.clientes_asignados.length >= asesor.max_clientes) {
      return res
        .status(400)
        .json({ error: "El asesor ha alcanzado su límite de clientes" });
    }

    // Asignar el cliente al asesor
    asesor.clientes_asignados.push(clienteId);
    asesor.max_clientes -= 1; // Reducir el límite de clientes disponibles
    // Guardar los cambios en el asesor
    await asesor.save();

    const asignacionAsesor = await Asignaciones.create({
      cliente_id: clienteId,
      asesor_id: asesorId,
    });

    console.log(asignacionAsesor);

    res
      .status(200)
      .json({ message: "Cliente asignado exitosamente al asesor." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asignar el cliente al asesor." });
  }
});

app.put("/updateAsesor", async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, max_clientes } = req.body; // El nuevo estado debe estar en el cuerpo de la solicitud

    const updatedAsesor = await Asesores.findByIdAndUpdate(
      id,
      { clientes_asignados }, // Actualiza el campo estado
      { new: true } // Devuelve el cliente actualizado
    );

    if (!updatedAsesor) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(updatedAsesor);
  } catch (error) {
    console.error("Error en la actualización del estado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
