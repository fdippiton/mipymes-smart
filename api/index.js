const express = require("express");
const config = require("../config");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose, connection } = require("mongoose");
const multer = require("multer");
const nodemailer = require("nodemailer");
const Cookies = require("js-cookie");
const jwtDecode = require("jwt-decode");
const { Parser } = require("papaparse");
const PDFDocument = require("pdfkit");

/* --------------------------------- Models --------------------------------- */
const Clientes = require("./models/Clientes");
const Administradores = require("./models/Administradores");
const Asesores = require("./models/Asesores");
const Asesorias = require("./models/Asesorias");
const DocAsesorias = require("./models/DocAsesorias");
const Talleres = require("./models/Talleres");
const Roles = require("./models/Roles");
const Estados = require("./models/Estados");
const Asignaciones = require("./models/Asignaciones");
const HistorialCambios = require("./models/HistorialCambios");
const HistorialCambiosAsesores = require("./models/HistorialCambiosAsesores");

/* ------------------------------- Middlewares ------------------------------ */
const app = express();
const PORT = config.SERVER_PORT || 3001;
const secretKey = config.SECRET_KEY;
const upload = multer();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

/* --------------------------- Database connection -------------------------- */
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

// Función para registrar un cambio
const registrarCambio = async (usuario, accion, detalles) => {
  try {
    const nuevoCambio = new HistorialCambios({ usuario, accion, detalles });
    await nuevoCambio.save();
    console.log("Cambio registrado exitosamente");
  } catch (error) {
    console.error("Error al registrar el cambio:", error);
  }
};

// Función para registrar un cambio hecho por los asesores
const registrarCambioAsesores = async (usuario, accion, detalles) => {
  try {
    const nuevoCambio = new HistorialCambiosAsesores({
      usuario,
      accion,
      detalles,
    });
    await nuevoCambio.save();
    console.log("Cambio registrado exitosamente");
  } catch (error) {
    console.error("Error al registrar el cambio:", error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                  Endpoints                                 */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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

app.get("/getAllAsesorias", async (req, res) => {
  try {
    const asesorias = await Asesorias.find();
    res.json(asesorias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateEstadoCliente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // El nuevo estado debe estar en el cuerpo de la solicitud

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);
    console.log(admin);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    const estado_descripcion = await Estados.findById(estado);
    if (!estado_descripcion) {
      return res.status(400).json({ error: "El estado no existe" });
    }

    const updatedClient = await Clientes.findByIdAndUpdate(
      id,
      { estado }, // Actualiza el campo estado
      { new: true } // Devuelve el cliente actualizado
    );

    if (!updatedClient) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} actualizó el estado del cliente ${updatedClient.nombre} a ${estado_descripcion.estado_descripcion}`
    );

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

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);
    console.log(admin);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} ha cambiado registrado un nuevo asesor ${nombre}`
    );
    res.status(200).json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el usuario asesor." });
  }
});

app.post("/registrarDocAsesoria", async (req, res) => {
  const {
    asesoria_id,
    cliente_id,
    asesor_id,
    fecha,
    hora,
    duracion_sesion,
    tema_principal,
    documentos_compartidos,
    temas_tratados,
    objetivos_acordados,
    talleres_recomendados,
    observaciones_adicionales,
    estado,
    foto,
  } = req.body;

  try {
    // Crear el cliente con el rol asignado
    const asesoriaDoc = await DocAsesorias.create({
      asesoria_id,
      cliente_id,
      asesor_id,
      fecha,
      hora,
      duracion_sesion,
      tema_principal,
      documentos_compartidos: null,
      temas_tratados: null,
      objetivos_acordados: null,
      talleres_recomendados: null,
      observaciones_adicionales: null,
      estado,
      foto: null,
    });

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const asesorDecoded = jwt.verify(token, secretKey);
    console.log("asesorDecoded", asesorDecoded);
    const asesor = await Asesores.findById(asesorDecoded.id);
    const cliente = await Clientes.findOne({
      _id: cliente_id,
    });

    if (!asesor) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }
    if (!cliente) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambioAsesores(
      asesorDecoded.id,
      `${asesor.nombre} ha registrado una nueva asesoria con tema ${tema_principal} pautada para el ${fecha} para el cliente ${cliente.nombre}`
    );

    res.status(200).json(asesoriaDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el documento de asesoria." });
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

app.get("/getAllDocAsesorias", async (req, res) => {
  try {
    const docAsesorias = await DocAsesorias.find()
      .populate("cliente_id")
      .populate("asesoria_id")
      .populate("talleres_recomendados");

    res.json(docAsesorias);
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

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);
    console.log(admin);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} ha asignado los asesores ${asesorDefinitivoEmpresarial.nombre}, ${asesorDefinitivoFinanciero.nombre} y ${asesorDefinitivoTecnologico.nombre}  al cliente ${cliente.nombre}`
    );
    res.status(200).json({
      message: "Asignación realizada exitosamente",
      nuevaAsignacion,
    });
  } catch (error) {
    console.error("Error al asignar cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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

// Endpoint para desasignar cliente
app.delete("/deshacerAsignacion/:clienteId", async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Buscar la asignación del cliente
    const asignacion = await Asignaciones.findOne({ cliente_id: clienteId });
    const docAsesorias = await DocAsesorias.findOne({ cliente_id: clienteId });

    if (!asignacion) {
      return res
        .status(404)
        .json({ error: "No se encontró asignación para este cliente." });
    }

    // Lista de asesores relacionados con el cliente
    const asesoresIds = [
      asignacion.asesor_empresarial_id,
      asignacion.asesor_financiero_id,
      asignacion.asesor_tecnologico_id,
    ].filter(Boolean); // Filtrar IDs válidos

    // Actualizar asesores en la base de datos
    for (const asesorId of asesoresIds) {
      await Asesores.findByIdAndUpdate(
        asesorId,
        {
          $pull: { clientes_asignados: clienteId }, // Remover cliente
          $inc: { max_clientes: 1 }, // Incrementar max_clientes
        },
        { new: true } // Opcional, para devolver el documento actualizado
      );
    }

    // Eliminar la asignación del cliente
    await asignacion.deleteOne();

    // Eliminar documentación del cliente solo si existe
    if (docAsesorias) {
      await docAsesorias.deleteOne();
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    const cliente = await Clientes.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} ha desasignado los asesores al cliente ${cliente.nombre}`
    );

    res.status(200).json({ message: "Cliente desasignado exitosamente." });
  } catch (error) {
    console.error("Error al desasignar cliente:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al desasignar el cliente." });
  }
});

app.get("/estadisticas", async (req, res) => {
  try {
    // 1. Total de clientes por estado
    const clientesPorEstado = await Clientes.aggregate([
      {
        $lookup: {
          from: "estados",
          localField: "estado",
          foreignField: "_id",
          as: "estado",
        },
      },
      { $unwind: "$estado" },
      {
        $group: {
          _id: "$estado.estado_descripcion",
          count: { $sum: 1 },
        },
      },
    ]);

    // 2. Total de clientes por rubro
    const clientesPorRubro = await Clientes.aggregate([
      {
        $group: {
          _id: "$rubro",
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Promedio de clientes asignados por asesor
    const totalClientesAsignados = await Asignaciones.countDocuments();
    const totalAsesores = await Asesores.countDocuments();
    const promedioClientesPorAsesor =
      totalAsesores > 0 ? totalClientesAsignados / totalAsesores : 0;

    // 4. Clientes por tipo de asesor asignado
    const clientesPorTipoAsesor = await Asignaciones.aggregate([
      {
        $facet: {
          empresarial: [
            { $group: { _id: "$asesor_empresarial_id", count: { $sum: 1 } } },
          ],
          financiero: [
            { $group: { _id: "$asesor_financiero_id", count: { $sum: 1 } } },
          ],
          tecnologico: [
            { $group: { _id: "$asesor_tecnologico_id", count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // 5. Servicios más requeridos por los clientes
    const serviciosRequeridos = await Clientes.aggregate([
      { $unwind: "$servicios_requeridos" },
      {
        $group: {
          _id: "$servicios_requeridos",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      clientesPorEstado,
      clientesPorRubro,
      promedioClientesPorAsesor,
      clientesPorTipoAsesor: clientesPorTipoAsesor[0],
      serviciosRequeridos,
    });
  } catch (error) {
    console.error("Error al generar estadísticas:", error);
    res.status(500).json({ message: "Error al generar estadísticas" });
  }
});

app.get("/estadisticas/asesores", async (req, res) => {
  try {
    const estadisticasPorAsesor = await Asignaciones.aggregate([
      {
        $group: {
          _id: "$asesor_empresarial_id",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ estadisticasPorAsesor });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al generar estadísticas por asesor" });
  }
});

app.get("/estadisticas/registroClientes", async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 30
    );
    const last60Days = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 60
    );
    const last90Days = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 90
    );

    const registroClientes = await Clientes.aggregate([
      {
        $match: {
          fecha_registro: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gte: ["$fecha_registro", last60Days] },
              "Últimos 60 días",
              "Últimos 30 días",
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ registroClientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al generar estadísticas de registro de clientes",
    });
  }
});

app.delete("/eliminarDocAsesoria/:docAsesoriaId", async (req, res) => {
  const { docAsesoriaId } = req.params;
  console.log("Recibido asesoriaId:", docAsesoriaId);

  if (!mongoose.Types.ObjectId.isValid(docAsesoriaId)) {
    return res.status(400).json({ error: "ID no válido" });
  }

  try {
    const docAsesoria = await DocAsesorias.findOne({
      _id: docAsesoriaId,
    }).populate("cliente_id");

    if (!docAsesoria) {
      return res.status(404).json({ error: "No se encontró doc asesoria" });
    }
    // Eliminar doc asesoria según tu modelo de datos
    await docAsesoria.deleteOne();

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const asesorDecoded = jwt.verify(token, secretKey);
    const asesor = await Asesores.findById(asesorDecoded.id);
    console.log(asesor);

    if (!asesor) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambioAsesores(
      asesorDecoded.id,
      `${asesor.nombre} ha eliminado la documentacion de la asesoria ${docAsesoria.tema_principal} del cliente ${docAsesoria.cliente_id.nombre}`
    );

    res.status(200).json({ message: "Documentacion eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la documentacion" });
  }
});

app.put("/docAsesoriasUpdate/:asesoriaIdDoc", async (req, res) => {
  try {
    const { asesoriaIdDoc } = req.params;

    if (!asesoriaIdDoc) {
      return res.status(400).json({ error: "ID no proporcionado" });
    }

    const {
      asesoria_id,
      cliente_id,
      asesor_id,
      fecha,
      hora,
      duracion_sesion,
      tema_principal,
      documentos_compartidos,
      temas_tratados,
      objetivos_acordados,
      talleres_recomendados,
      observaciones_adicionales,
      estado,
    } = req.body;

    console.log("Datos recibidos en el backend:", req.body);

    // Validación adicional si es necesario
    const docAsesoria = await DocAsesorias.findById(asesoriaIdDoc);
    if (!docAsesoria) {
      return res.status(404).json({ error: "Doc asesoria no encontrado" });
    }

    const updatedDocAsesoria = await DocAsesorias.findByIdAndUpdate(
      asesoriaIdDoc,
      {
        asesoria_id,
        cliente_id,
        asesor_id,
        fecha,
        hora,
        duracion_sesion,
        tema_principal,
        documentos_compartidos,
        temas_tratados,
        objetivos_acordados,
        talleres_recomendados,
        observaciones_adicionales,
        estado,
      },
      { new: true }
    );

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const asesorDecoded = jwt.verify(token, secretKey);
    const asesor = await Asesores.findById(asesorDecoded.id);
    const cliente = await Clientes.findOne({
      _id: cliente_id,
    });

    if (!cliente) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }
    console.log(asesor);

    if (!asesor) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambioAsesores(
      asesorDecoded.id,
      `${asesor.nombre} ha actualizado la asesoria ${tema_principal} del cliente ${cliente.nombre}`
    );

    res.status(200).json(updatedDocAsesoria);
  } catch (error) {
    console.error("Error en la actualización de la documentación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/enviar-correo", async (req, res) => {
  const { email, nombre } = req.body;

  // Validación de entrada
  if (!email || !nombre) {
    return res
      .status(400)
      .json({ message: "Faltan datos obligatorios: email y nombre." });
  }

  try {
    // Crear cuenta de prueba en Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // Configuración del transporte
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true para 465, false para otros puertos
      auth: {
        user: testAccount.user, // Usuario de prueba
        pass: testAccount.pass, // Contraseña de prueba
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: '"Soporte" <soporte@dippitonpiton.com>', // Remitente
      to: email, // Destinatario
      subject: "¡Tu solicitud ha sido aprobada!", // Asunto
      text: `Hola ${nombre}, tu solicitud ha sido aprobada. ¡Bienvenid@ a MiPymes Unphu Smart!`, // Contenido en texto plano
      html: `<p>Hola <strong>${nombre}</strong>, tu solicitud ha sido aprobada. ¡Bienvenidd@ a MiPymes Unphu Smart!</p>`, // Contenido en HTML
    };

    // Enviar correo
    const info = await transporter.sendMail(mailOptions);

    console.log("Correo enviado:", info.messageId); // ID del mensaje enviado
    console.log("Vista previa del correo:", nodemailer.getTestMessageUrl(info)); // URL del correo

    res.status(200).json({
      message: "Correo enviado exitosamente (prueba).",
      previewUrl: nodemailer.getTestMessageUrl(info), // Incluimos la URL de vista previa
    });
  } catch (error) {
    console.error("Error detallado al enviar el correo:", error);
    res.status(500).json({
      message: "Error interno al enviar el correo.",
      error: error.message,
    });
  }
});

app.get("/historial-cambios", async (req, res) => {
  try {
    const historial = await HistorialCambios.find()
      .sort({ fecha: -1 })
      .populate("usuario");
    res.status(200).json(historial);
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    res.status(500).send("Error en el servidor.");
  }
});

app.get("/historial-cambios-asesores", async (req, res) => {
  try {
    const historial = await HistorialCambiosAsesores.find()
      .sort({ fecha: -1 })
      .populate("usuario");
    res.status(200).json(historial);
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    res.status(500).send("Error en el servidor.");
  }
});

app.get("/estadisticas/reporte", async (req, res) => {
  try {
    // Generar las estadísticas
    const clientesPorEstado = await Clientes.aggregate([
      {
        $lookup: {
          from: "estados",
          localField: "estado",
          foreignField: "_id",
          as: "estado",
        },
      },
      { $unwind: "$estado" },
      {
        $group: {
          _id: "$estado.estado_descripcion",
          count: { $sum: 1 },
        },
      },
    ]);

    const clientesPorRubro = await Clientes.aggregate([
      {
        $group: {
          _id: "$rubro",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalClientes = await Clientes.countDocuments();
    const totalAsesores = await Asesores.countDocuments();

    const totalClientesAsignados = await Asignaciones.countDocuments();
    const promedioClientesPorAsesor =
      totalAsesores > 0 ? totalClientesAsignados / totalAsesores : 0;

    const serviciosRequeridos = await Clientes.aggregate([
      { $unwind: "$servicios_requeridos" },
      {
        $group: {
          _id: "$servicios_requeridos",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Crear el PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Configurar encabezados para la descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_estadisticas.pdf"
    );

    // Pipe del documento al response
    doc.pipe(res);

    // Encabezado principal
    doc
      .fontSize(20)
      .text("Reporte de Estadísticas", { align: "center" })
      .moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Generado por: MiPymes Unphu Smart`, { align: "center" });
    doc
      .fontSize(12)
      .text(`Fecha: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown();

    // 1. Estadísticas Generales
    doc
      .fontSize(14)
      .text("1. Estadísticas Generales", { underline: true })
      .moveDown(0.5);
    doc.text(`Total de Clientes: ${totalClientes}`);
    doc.text(`Total de Asesores: ${totalAsesores}`);
    doc.text(
      `Promedio de Clientes por Asesor: ${promedioClientesPorAsesor.toFixed(2)}`
    );

    doc.moveDown();

    // 2. Clientes por Estado
    doc
      .fontSize(14)
      .text("2. Clientes por Estado", { underline: true })
      .moveDown(0.5);
    clientesPorEstado.forEach((estado) => {
      doc.text(`${estado._id}: ${estado.count} clientes`);
    });
    doc.moveDown();

    // 3. Clientes por Rubro
    doc
      .fontSize(14)
      .text("3. Clientes por Rubro", { underline: true })
      .moveDown(0.5);
    clientesPorRubro.forEach((rubro) => {
      doc.text(`${rubro._id || "Sin especificar"}: ${rubro.count} clientes`);
    });
    doc.moveDown();

    // 4. Servicios más Requeridos
    doc
      .fontSize(14)
      .text("4. Servicios más Requeridos", { underline: true })
      .moveDown(0.5);
    serviciosRequeridos.forEach((servicio) => {
      doc.text(`${servicio._id}: ${servicio.count} solicitudes`);
    });
    doc.moveDown();

    // Pie de página
    doc.moveDown(2);
    doc
      .fontSize(10)
      .text(
        "Este reporte fue generado automáticamente por MiPymes Unphu Smart.",
        {
          align: "center",
        }
      );

    // Finalizar el documento
    doc.end();

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);
    console.log(admin);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} ha descargado un reporte de estadisticas.`
    );
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    res.status(500).json({ message: "Error al generar el reporte" });
  }
});

app.get("/getAllClienteDocAsesorias/:idCliente", async (req, res) => {
  try {
    // Obtén el idCliente desde los parámetros de la ruta
    const { idCliente } = req.params;

    // Encuentra las asesorías asociadas al cliente
    const docAsesorias = await DocAsesorias.find({ cliente_id: idCliente })
      .populate("cliente_id")
      .populate("asesoria_id")
      .populate("talleres_recomendados");

    // Devuelve las asesorías como respuesta
    res.json(docAsesorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/registrarTaller", async (req, res) => {
  const { titulo, descripcion, fecha, hora, instructor } = req.body;

  // Validar los datos
  if (!titulo || !descripcion || !fecha || !instructor) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    // Crear el cliente con el rol asignado
    const taller = await Talleres.create({
      titulo,
      descripcion,
      fecha,
      hora,
      instructor,
    });

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const adminDecoded = jwt.verify(token, secretKey);
    const admin = await Administradores.findById(adminDecoded.id);
    console.log(admin);

    if (!admin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para realizar esta acción" });
    }

    await registrarCambio(
      adminDecoded.id,
      `${admin.nombre} ha registrado un nuevo taller titulado ${titulo} pautado para el ${fecha} a las ${hora}`
    );

    res.status(200).json(taller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear taller." });
  }
});

app.get("/getTalleres", async (req, res) => {
  try {
    const talleres = await Talleres.find(); // Assuming Clients is a model for the clients collection
    res.json(talleres);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
