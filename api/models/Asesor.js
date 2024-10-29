const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const asesorSchema = new Schema({
  asesor_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
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

const asesorModel = model("Asesor", asesorSchema);

module.exports = asesorModel;
