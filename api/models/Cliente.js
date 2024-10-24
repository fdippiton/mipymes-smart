const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const clienteSchema = new Schema({
  cliente_id: { type: String, required: true },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: "Rol", required: true },
  nombre: { type: String, required: true },
  contacto: {
    email_cliente: { type: String, required: true },
    telefono: { type: String, required: true },
    email_empresa: { type: String, required: true },
  },
  fecha_registro: { type: Date, default: Date.now },
  rubro: { type: String, required: true },
  descripcion_servicios: { type: String, required: true },
  servicios_requeridos: [{ type: String, required: true }],
  conocio_CMU: [{ type: String, required: true }],
  estado: { type: String, required: true, default: "En proceso de contacto" },
  ingresos: { type: String },
});

const clienteModel = model("Cliente", clienteSchema);

module.exports = clienteModel;
