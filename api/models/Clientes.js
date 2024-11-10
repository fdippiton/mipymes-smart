const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ClientesSchema = new Schema({
  rol: { type: mongoose.Schema.Types.ObjectId, ref: "Roles", required: true },
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
  nombre_empresa: { type: String, required: true },
  contacto: {
    email_cliente: { type: String, required: true },
    email_empresa: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  rubro: { type: String, required: true },
  descripcion_servicios: { type: String, required: true },
  servicios_requeridos: [{ type: String, required: true }],
  conocio_CMU: [{ type: String, required: true }],
  estado: { type: String, required: true, default: "En proceso de contacto" },
  ingresos: { type: String },
  fecha_registro: { type: Date, default: Date.now },
});

const ClientesModel = model("Clientes", ClientesSchema);

module.exports = ClientesModel;
