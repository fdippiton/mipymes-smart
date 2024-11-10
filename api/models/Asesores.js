const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AsesoresSchema = new Schema({
  asesor_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
  contacto: {
    email: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  especialidades: [{ type: String, required: true }],
  clientes_asignados: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  ],
  max_clientes: { type: Number, required: true },
});

const AsesoresModel = model("Asesores", AsesoresSchema);

module.exports = AsesoresModel;
