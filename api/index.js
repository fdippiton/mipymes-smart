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

app.get("/getAllAsesorClientes", async (req, res) => {
  const token = req.cookies.token; // Accede al token desde las cookies

  try {
    if (!token) {
      return res.status(401).json({ error: "No se proporcionó token." });
    }

    // Decodificar el token para obtener el ID del asesor
    const decoded = jwt.verify(token, secretKey);

    // Buscar al asesor por ID
    const asesor = await Asesores.findById(decoded.id); // Cambiado a findById para buscar un único documento por ID

    if (!asesor) {
      return res.status(404).json({ message: "No se encontró este asesor." });
    }

    // Buscar asignaciones donde este asesor esté asignado en cualquiera de los roles
    const asignaciones = await Asignaciones.find({
      $or: [
        { asesor_empresarial_id: decoded.id },
        { asesor_financiero_id: decoded.id },
        { asesor_tecnologico_id: decoded.id },
      ],
    }).populate("cliente_id"); // Poblar la información del cliente

    if (asignaciones.length === 0) {
      return res.status(404).json({
        message: "No se encontraron clientes asignados para este asesor.",
      });
    }

    // Enviar las asignaciones encontradas como respuesta
    res.json(asignaciones);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
  const { nombre, contrasena, email, telefono, especialidades, metaClientes } =
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
      max_clientes: metaClientes, // Inicialmente, no tiene clientes asociados
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
    const asesores = await Asesores.find().populate("clientes_asignados"); // Assuming Clients is a model for the clients collection
    res.json(asesores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllAsignaciones", async (req, res) => {
  try {
    const asignaciones = await Asignaciones.find()
      .populate("cliente_id")
      .populate("asesor_empresarial_id")
      .populate("asesor_financiero_id")
      .populate("asesor_tecnologico_id");
    // .populate("encuentro_asesor_empresarial_id")
    // .populate("encuentro_asesor_financiero_id")
    // .populate("encuentro_asesor_tecnologico_id");

    res.json(asignaciones);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/asignarClienteAAsesor", async (req, res) => {
  const { clienteId } = req.body;

  try {
    // Verificar si el cliente existe
    const cliente = await Clientes.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // Verificar si ya tiene una asignación
    const asignacionExistente = await Asignaciones.findOne({
      cliente_id: clienteId,
    });
    if (asignacionExistente) {
      return res.status(400).json({
        error: "El cliente ya tiene una asignación registrada",
      });
    }

    // Obtener asesores y calcular cargas
    const asesores = await Asesores.find();
    const asesoresDisponibles = asesores.map((asesor) => ({
      ...asesor.toObject(),
      carga:
        // (asesor.clientes_encuentros?.length || 0) +
        asesor.clientes_asignados?.length || 0,
    }));

    // Función de asignación equitativa
    const asignarAsesorEquitativo = (
      especialidad,
      tipo,
      preseleccionados = []
    ) => {
      // Filtrar asesores según la especialidad y disponibilidad solo para "definitivos"
      const filtrados = asesoresDisponibles.filter((asesor) => {
        const cumpleEspecialidad = asesor.especialidades.includes(especialidad);

        // Solo considerar "clientes_asignados" para la asignación definitiva
        const dentroDeLimites =
          tipo === "definitivos"
            ? (asesor.clientes_asignados?.length || 0) <
              (asesor.max_clientes || Infinity)
            : false;

        return cumpleEspecialidad && dentroDeLimites;
      });

      // Si no hay asesores disponibles, agregar los preseleccionados
      if (filtrados.length === 0 && preseleccionados.length > 0) {
        preseleccionados.forEach((preseleccionado) => {
          const preseleccionadoConCarga = asesoresDisponibles.find(
            (asesor) => asesor._id.toString() === preseleccionado._id.toString()
          );
          if (preseleccionadoConCarga) {
            filtrados.push(preseleccionadoConCarga);
          }
        });
      }

      // Si todos los asesores tienen la misma carga (cero), asignar de forma cíclica o aleatoria
      if (filtrados.every((asesor) => asesor.carga === 0)) {
        // Asignación cíclica aleatoria si todos tienen la misma carga
        return filtrados[Math.floor(Math.random() * filtrados.length)];
      }

      // Si no todos tienen la misma carga, asignar al que menos carga tiene
      // Mejoramos la lógica para repartir de forma equitativa:
      // Se calcula la carga de cada asesor (clientes asignados)
      // y se asigna el asesor con menos carga total.
      const asesorMenosCargado = filtrados.reduce((prev, curr) => {
        // Calcular carga total del asesor
        const cargaPrev = prev.clientes_asignados?.length || 0;
        const cargaCurr = curr.clientes_asignados?.length || 0;

        // Comparar las cargas
        return cargaPrev < cargaCurr ? prev : curr;
      });

      return asesorMenosCargado;
    };

    // Asignar asesores para encuentros iniciales
    // const asesorEncuentroEmpresarial = asignarAsesorEquitativo(
    //   "Asesoría Empresarial",
    //   "encuentros"
    // );
    // const asesorEncuentroFinanciero = asignarAsesorEquitativo(
    //   "Asesoría Financiera",
    //   "encuentros"
    // );
    // const asesorEncuentroTecnologico = asignarAsesorEquitativo(
    //   "Asesoría Tecnologica",
    //   "encuentros"
    // );

    // console.log("Asesoría Empresarial encuentros", asesorEncuentroEmpresarial);
    // console.log("Asesoría Financiera encuentros", asesorEncuentroFinanciero);
    // console.log("Asesoría Tecnologica encuentros", asesorEncuentroTecnologico);

    // if (
    //   !asesorEncuentroEmpresarial ||
    //   !asesorEncuentroFinanciero ||
    //   !asesorEncuentroTecnologico
    // ) {
    //   return res.status(400).json({
    //     error: "No hay asesores disponibles para encuentros.",
    //   });
    // }

    // Actualizar datos de asesores de encuentros
    // await Promise.all([
    //   Asesores.updateOne(
    //     { _id: asesorEncuentroEmpresarial._id },
    //     {
    //       $push: { clientes_encuentros: clienteId },
    //       $inc: { max_encuentros: -1 },
    //     }
    //   ),
    //   Asesores.updateOne(
    //     { _id: asesorEncuentroFinanciero._id },
    //     {
    //       $push: { clientes_encuentros: clienteId },
    //       $inc: { max_encuentros: -1 },
    //     }
    //   ),
    //   Asesores.updateOne(
    //     { _id: asesorEncuentroTecnologico._id },
    //     {
    //       $push: { clientes_encuentros: clienteId },
    //       $inc: { max_encuentros: -1 },
    //     }
    //   ),
    // ]);

    // Asignar asesores definitivos
    const asesorDefinitivoEmpresarial = asignarAsesorEquitativo(
      "Asesoría Empresarial",
      "definitivos"
    );
    const asesorDefinitivoFinanciero = asignarAsesorEquitativo(
      "Asesoría Financiera",
      "definitivos"
    );
    const asesorDefinitivoTecnologico = asignarAsesorEquitativo(
      "Asesoría Tecnologica",
      "definitivos"
    );

    // console.log("Asesoría Empresarial", asesorDefinitivoEmpresarial);
    // console.log("Asesoría Financiera", asesorDefinitivoFinanciero);
    // console.log("Asesoría Tecnologica", asesorDefinitivoTecnologico);

    if (
      !asesorDefinitivoEmpresarial ||
      !asesorDefinitivoFinanciero ||
      !asesorDefinitivoTecnologico
    ) {
      return res.status(400).json({
        error: "No hay asesores disponibles para definitivos.",
      });
    }

    // Actualizar datos de asesores definitivos
    await Promise.all([
      Asesores.updateOne(
        { _id: asesorDefinitivoEmpresarial._id },
        { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
      ),
      Asesores.updateOne(
        { _id: asesorDefinitivoFinanciero._id },
        { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
      ),
      Asesores.updateOne(
        { _id: asesorDefinitivoTecnologico._id },
        { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
      ),
    ]);

    // Crear la asignación
    const nuevaAsignacion = await Asignaciones.create({
      cliente_id: clienteId,
      // encuentro_asesor_empresarial_id: asesorEncuentroEmpresarial._id,
      // encuentro_asesor_financiero_id: asesorEncuentroFinanciero._id,
      // encuentro_asesor_tecnologico_id: asesorEncuentroTecnologico._id,
      asesor_empresarial_id: asesorDefinitivoEmpresarial._id,
      asesor_financiero_id: asesorDefinitivoFinanciero._id,
      asesor_tecnologico_id: asesorDefinitivoTecnologico._id,
    });

    res.status(200).json({
      message: "Asignación realizada exitosamente",
      nuevaAsignacion,
    });
  } catch (error) {
    console.error("Error al asignar cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// app.post("/asignarClienteAAsesor", async (req, res) => {
//   const { clienteId } = req.body;

//   try {
//     // Verificar si el cliente existe
//     const cliente = await Clientes.findById(clienteId);
//     if (!cliente) {
//       return res.status(404).json({ error: "Cliente no encontrado" });
//     }

//     // Verificar si ya tiene una asignación
//     const asignacionExistente = await Asignaciones.findOne({
//       cliente_id: clienteId,
//     });
//     if (asignacionExistente) {
//       return res.status(400).json({
//         error: "El cliente ya tiene una asignación registrada",
//       });
//     }

//     // Obtener asesores y calcular cargas
//     const asesores = await Asesores.find();
//     const asesoresDisponibles = asesores.map((asesor) => ({
//       ...asesor.toObject(),
//       carga:
//         (asesor.clientes_encuentros?.length || 0) +
//         (asesor.clientes_asignados?.length || 0),
//     }));

//     // Función de asignación equitativa
//     const asignarAsesorEquitativo = (
//       especialidad,
//       tipo,
//       preseleccionados = []
//     ) => {
//       // Filtrar asesores según la especialidad y disponibilidad
//       const filtrados = asesoresDisponibles.filter((asesor) => {
//         const cumpleEspecialidad = asesor.especialidades.includes(especialidad);
//         const dentroDeLimites =
//           tipo === "encuentros"
//             ? (asesor.clientes_encuentros?.length || 0) < asesor.max_encuentros
//             : (asesor.clientes_asignados?.length || 0) < asesor.max_clientes;

//         return cumpleEspecialidad && dentroDeLimites;
//       });

//       // Si no hay asesores disponibles, agregar los preseleccionados
//       if (filtrados.length === 0 && preseleccionados.length > 0) {
//         preseleccionados.forEach((preseleccionado) => {
//           const preseleccionadoConCarga = asesoresDisponibles.find(
//             (asesor) => asesor._id.toString() === preseleccionado._id.toString()
//           );
//           if (preseleccionadoConCarga) {
//             filtrados.push(preseleccionadoConCarga);
//           }
//         });
//       }

//       // Si todos los asesores tienen la misma carga (cero), asignar de forma cíclica
//       if (filtrados.every((asesor) => asesor.carga === 0)) {
//         // Encontrar el índice del asesor anterior en la lista de asesores disponibles
//         let ultimoIndice = asesoresDisponibles.findIndex((asesor) =>
//           preseleccionados.includes(asesor._id.toString())
//         );
//         // Asignar al siguiente asesor en la lista
//         let siguienteIndice = (ultimoIndice + 1) % asesoresDisponibles.length;
//         return asesoresDisponibles[siguienteIndice];
//       }

//       // Si no todos tienen la misma carga, asignar al que menos carga tiene
//       return filtrados.sort((a, b) => a.carga - b.carga)[0];
//     };

//     // Asignar asesores para encuentros iniciales
//     const preseleccionadosEncuentros = [];

//     const asesorEncuentroEmpresarial = asignarAsesorEquitativo(
//       "Asesoría Empresarial",
//       "encuentros",
//       preseleccionadosEncuentros
//     );
//     const asesorEncuentroFinanciero = asignarAsesorEquitativo(
//       "Asesoría Financiera",
//       "encuentros",
//       preseleccionadosEncuentros
//     );
//     const asesorEncuentroTecnologico = asignarAsesorEquitativo(
//       "Asesoría Tecnologica",
//       "encuentros",
//       preseleccionadosEncuentros
//     );

//     if (
//       !asesorEncuentroEmpresarial ||
//       !asesorEncuentroFinanciero ||
//       !asesorEncuentroTecnologico
//     ) {
//       return res.status(400).json({
//         error: "No hay asesores disponibles para encuentros.",
//       });
//     }

//     // Actualizar datos de asesores de encuentros
//     await Promise.all([
//       Asesores.updateOne(
//         { _id: asesorEncuentroEmpresarial._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//       Asesores.updateOne(
//         { _id: asesorEncuentroFinanciero._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//       Asesores.updateOne(
//         { _id: asesorEncuentroTecnologico._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//     ]);

//     // Asignar asesores definitivos
//     const preseleccionadosDefinitivos = [];

//     const asesorDefinitivoEmpresarial = asignarAsesorEquitativo(
//       "Asesoría Empresarial",
//       "definitivos",
//       preseleccionadosDefinitivos
//     );
//     const asesorDefinitivoFinanciero = asignarAsesorEquitativo(
//       "Asesoría Financiera",
//       "definitivos",
//       preseleccionadosDefinitivos
//     );
//     const asesorDefinitivoTecnologico = asignarAsesorEquitativo(
//       "Asesoría Tecnologica",
//       "definitivos",
//       preseleccionadosDefinitivos
//     );

//     if (
//       !asesorDefinitivoEmpresarial ||
//       !asesorDefinitivoFinanciero ||
//       !asesorDefinitivoTecnologico
//     ) {
//       return res.status(400).json({
//         error: "No hay asesores disponibles para definitivos.",
//       });
//     }

//     // Actualizar datos de asesores definitivos
//     await Promise.all([
//       Asesores.updateOne(
//         { _id: asesorDefinitivoEmpresarial._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//       Asesores.updateOne(
//         { _id: asesorDefinitivoFinanciero._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//       Asesores.updateOne(
//         { _id: asesorDefinitivoTecnologico._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//     ]);

//     // Crear la asignación
//     const nuevaAsignacion = await Asignaciones.create({
//       cliente_id: clienteId,
//       encuentro_asesor_empresarial_id: asesorEncuentroEmpresarial._id,
//       encuentro_asesor_financiero_id: asesorEncuentroFinanciero._id,
//       encuentro_asesor_tecnologico_id: asesorEncuentroTecnologico._id,
//       asesor_empresarial_id: asesorDefinitivoEmpresarial._id,
//       asesor_financiero_id: asesorDefinitivoFinanciero._id,
//       asesor_tecnologico_id: asesorDefinitivoTecnologico._id,
//     });

//     res.status(200).json({
//       message: "Asignación realizada exitosamente",
//       nuevaAsignacion,
//     });
//   } catch (error) {
//     console.error("Error al asignar cliente:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// app.post("/asignarClienteAAsesor", async (req, res) => {
//   const { clienteId } = req.body;

//   try {
//     // Verificar si el cliente existe
//     const cliente = await Clientes.findById(clienteId);
//     if (!cliente) {
//       return res.status(404).json({ error: "Cliente no encontrado" });
//     }

//     // Verificar si ya tiene una asignación
//     const asignacionExistente = await Asignaciones.findOne({
//       cliente_id: clienteId,
//     });
//     if (asignacionExistente) {
//       return res
//         .status(400)
//         .json({ error: "El cliente ya tiene una asignación registrada" });
//     }

//     // Obtener asesores y calcular cargas
//     const asesores = await Asesores.find();
//     const asesoresDisponibles = asesores.map((asesor) => ({
//       ...asesor.toObject(),
//       carga:
//         (asesor.clientes_encuentros?.length || 0) +
//         (asesor.clientes_asignados?.length || 0), // Manejar valores vacíos
//     }));

//     const asignarAsesorEquitativo = (especialidad, tipo) => {
//       const filtrados = asesoresDisponibles.filter((asesor) => {
//         const cumpleEspecialidad = asesor.especialidades.includes(especialidad);
//         const dentroDeLimites =
//           tipo === "encuentros"
//             ? (asesor.clientes_encuentros?.length || 0) < asesor.max_encuentros
//             : (asesor.clientes_asignados?.length || 0) < asesor.max_clientes;

//         return cumpleEspecialidad && dentroDeLimites;
//       });

//       return filtrados.sort((a, b) => a.carga - b.carga)[0]; // Asignar al menos cargado
//     };

//     // Asignar asesores para encuentros iniciales
//     const asesorEncuentroEmpresarial = asignarAsesorEquitativo(
//       "Asesoría Empresarial",
//       "encuentros"
//     );
//     const asesorEncuentroFinanciero = asignarAsesorEquitativo(
//       "Asesoría Financiera",
//       "encuentros"
//     );
//     const asesorEncuentroTecnologico = asignarAsesorEquitativo(
//       "Asesoría Tecnologica",
//       "encuentros"
//     );

//     console.log("Asesoría Empresarial", asesorEncuentroEmpresarial);
//     console.log("Asesoría Financiera", asesorEncuentroFinanciero);
//     console.log("Asesoría Tecnológica", asesorEncuentroTecnologico);

//     if (
//       !asesorEncuentroEmpresarial ||
//       !asesorEncuentroFinanciero ||
//       !asesorEncuentroTecnologico
//     ) {
//       return res
//         .status(400)
//         .json({ error: "No hay asesores disponibles para encuentros." });
//     }

//     // Actualizar datos de asesores de encuentros
//     await Promise.all([
//       Asesores.updateOne(
//         { _id: asesorEncuentroEmpresarial._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//       Asesores.updateOne(
//         { _id: asesorEncuentroFinanciero._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//       Asesores.updateOne(
//         { _id: asesorEncuentroTecnologico._id },
//         {
//           $push: { clientes_encuentros: clienteId },
//           $inc: { max_encuentros: -1 },
//         }
//       ),
//     ]);

//     // Asignar asesores definitivos
//     const asesorDefinitivoEmpresarial = asignarAsesorEquitativo(
//       "Asesoría Empresarial",
//       "definitivos"
//     );
//     const asesorDefinitivoFinanciero = asignarAsesorEquitativo(
//       "Asesoría Financiera",
//       "definitivos"
//     );
//     const asesorDefinitivoTecnologico = asignarAsesorEquitativo(
//       "Asesoría Tecnologica",
//       "definitivos"
//     );

//     if (
//       !asesorDefinitivoEmpresarial ||
//       !asesorDefinitivoFinanciero ||
//       !asesorDefinitivoTecnologico
//     ) {
//       return res
//         .status(400)
//         .json({ error: "No hay asesores disponibles para definitivos." });
//     }

//     // Actualizar datos de asesores definitivos
//     await Promise.all([
//       Asesores.updateOne(
//         { _id: asesorDefinitivoEmpresarial._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//       Asesores.updateOne(
//         { _id: asesorDefinitivoFinanciero._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//       Asesores.updateOne(
//         { _id: asesorDefinitivoTecnologico._id },
//         { $push: { clientes_asignados: clienteId }, $inc: { max_clientes: -1 } }
//       ),
//     ]);

//     // Crear la asignación
//     const nuevaAsignacion = await Asignaciones.create({
//       cliente_id: clienteId,
//       encuentro_asesor_empresarial_id: asesorEncuentroEmpresarial._id,
//       encuentro_asesor_financiero_id: asesorEncuentroFinanciero._id,
//       encuentro_asesor_tecnologico_id: asesorEncuentroTecnologico._id,
//       asesor_empresarial_id: asesorDefinitivoEmpresarial._id,
//       asesor_financiero_id: asesorDefinitivoFinanciero._id,
//       asesor_tecnologico_id: asesorDefinitivoTecnologico._id,
//     });

//     res
//       .status(200)
//       .json({ message: "Asignación realizada exitosamente", nuevaAsignacion });
//   } catch (error) {
//     console.error("Error al asignar cliente:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// app.post("/asignarClienteAAsesor", async (req, res) => {
//   const {
//     clienteId,
//     asesorEmpresarialId,
//     asesorFinancieroId,
//     asesorTecnologicoId,
//     asesorDefinitivoEmpresarialId,
//     asesorDefinitivoFinancieroId,
//     asesorDefinitivoTecnologicoId,
//   } = req.body;

//   try {
//     // Filtrar asesores disponibles
//     const asesores = await Asesores.find({
//       _id: {
//         $in: [
//           asesorEmpresarialId,
//           asesorFinancieroId,
//           asesorTecnologicoId,
//           asesorDefinitivoEmpresarialId,
//           asesorDefinitivoFinancieroId,
//           asesorDefinitivoTecnologicoId,
//         ],
//       },
//     });

//     console.log(asesores);

//     // if (asesores.length !== 6) {
//     //   return res
//     //     .status(404)
//     //     .json({ error: "Uno o más asesores no encontrados" });
//     // }

//     // Verificar si el cliente existe
//     const cliente = await Clientes.findById(clienteId);
//     if (!cliente) {
//       return res.status(404).json({ error: "Cliente no encontrado" });
//     }

//     // Verificar si ya tiene una asignación
//     const asignacionExistente = await Asignaciones.findOne({
//       cliente_id: clienteId,
//     });
//     if (asignacionExistente) {
//       return res
//         .status(400)
//         .json({ error: "El cliente ya tiene una asignación registrada" });
//     }

//     // Asignar asesores para los encuentros iniciales
//     const asesoresDisponibles = asesores.map((asesor) => ({
//       ...asesor.toObject(),
//       carga:
//         asesor.clientes_encuentros.length + asesor.clientes_asignados.length,
//     }));

//     const asignarAsesorEquitativo = (asesoresDisponibles, especialidad) => {
//       return asesoresDisponibles
//         .filter((asesor) => asesor.especialidades.includes(especialidad))
//         .sort((a, b) => a.carga - b.carga)[0]; // Asignar al menos cargado
//     };

//     const asesorEmpresarial = asignarAsesorEquitativo(
//       asesoresDisponibles,
//       "Asesoría Empresarial"
//     );
//     const asesorFinanciero = asignarAsesorEquitativo(
//       asesoresDisponibles,
//       "Asesoría Financiera"
//     );
//     const asesorTecnologico = asignarAsesorEquitativo(
//       asesoresDisponibles,
//       "Asesoría Tecnológica"
//     );

//     // Actualizar los asesores con las asignaciones temporales
//     const updateAsesor = async (asesorId, clienteId) => {
//       try {
//         await Asesores.updateOne(
//           { _id: asesorId },
//           {
//             $push: { clientes_encuentros: clienteId },
//             $inc: { max_encuentros: -1 },
//           }
//         );
//       } catch (error) {
//         console.error(`Error al actualizar asesor con ID ${asesorId}:`, error);
//       }
//     };

//     await Promise.all([
//       updateAsesor(asesorEmpresarialId, clienteId),
//       updateAsesor(asesorFinancieroId, clienteId),
//       updateAsesor(asesorTecnologicoId, clienteId),
//     ]);

//     // Asignar asesores definitivos

//     const updateAsesorDefinitivo = async (asesorId, clienteId) => {
//       try {
//         await Asesores.updateOne(
//           { _id: asesorId },
//           {
//             $push: { clientes_asignados: clienteId },
//             $inc: { max_clientes: -1 },
//           }
//         );
//       } catch (error) {
//         console.error(`Error al actualizar asesor con ID ${asesorId}:`, error);
//       }
//     };

//     await Promise.all([
//       updateAsesorDefinitivo(asesorDefinitivoEmpresarialId, clienteId),
//       updateAsesorDefinitivo(asesorDefinitivoFinancieroId, clienteId),
//       updateAsesorDefinitivo(asesorDefinitivoTecnologicoId, clienteId),
//     ]);

//     // Crear la asignación
//     const nuevaAsignacion = await Asignaciones.create({
//       cliente_id: clienteId,
//       asesor_empresarial_id: asesorDefinitivoEmpresarialId,
//       asesor_financiero_id: asesorDefinitivoFinancieroId,
//       asesor_tecnologico_id: asesorDefinitivoTecnologicoId,
//       encuentro_asesor_empresarial_id: asesorEmpresarialId,
//       encuentro_asesor_financiero_id: asesorFinancieroId,
//       encuentro_asesor_tecnologico_id: asesorTecnologicoId,
//     });

//     res
//       .status(200)
//       .json({ message: "Asignación realizada exitosamente", nuevaAsignacion });
//   } catch (error) {
//     console.log("Error al asignar cliente:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// app.post("/asignarClienteAAsesor", async (req, res) => {
//   const { clienteId, asesorId } = req.body;

//   // console.log("data recieved", clienteId, asesorId);

//   try {
//     // Asignar el cliente al asesor
//     const asesor = await Asesores.findById(asesorId);
//     const cliente = await Clientes.findById(clienteId);

//     // console.log("data recieved", asesor, cliente);
//     // Verificar que el asesor y el cliente existen
//     if (!asesor || !cliente) {
//       return res.status(404).json({ error: "Asesor o cliente no encontrado" });
//     }

//     // Verificar si el cliente ya está asignado al asesor
//     if (asesor.clientes_asignados.includes(clienteId)) {
//       return res
//         .status(400)
//         .json({ error: "El cliente ya está asignado a este asesor" });
//     }

//     // Verificar si el cliente ya tiene una asignación en la colección Asignaciones
//     const asignacionExistente = await Asignaciones.findOne({
//       cliente_id: clienteId,
//     });

//     if (asignacionExistente) {
//       return res
//         .status(400)
//         .json({ error: "El cliente ya tiene una asignación con otro asesor." });
//     }

//     // Verificar si el asesor ha alcanzado su límite de clientes
//     if (asesor.clientes_asignados.length >= asesor.max_clientes) {
//       return res
//         .status(400)
//         .json({ error: "El asesor ha alcanzado su límite de clientes" });
//     }

//     // Asignar el cliente al asesor
//     asesor.clientes_asignados.push(clienteId);
//     asesor.max_clientes -= 1; // Reducir el límite de clientes disponibles
//     // Guardar los cambios en el asesor
//     await asesor.save();

//     const asignacionAsesor = await Asignaciones.create({
//       cliente_id: clienteId,
//       asesor_id: asesorId,
//     });

//     console.log(asignacionAsesor);

//     res
//       .status(200)
//       .json({ message: "Cliente asignado exitosamente al asesor." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al asignar el cliente al asesor." });
//   }
// });

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
