const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AsesoriasSchema = new Schema({
  asesoria_id: { type: String, required: true, unique: true },
  nombre_asesoria: { type: String, required: true },
});

const AsesoriasModel = model("Asesorias", AsesoriasSchema);

module.exports = AsesoriasModel;
