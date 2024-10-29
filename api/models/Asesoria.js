const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const asesoriaSchema = new Schema({
  asesoria_id: { type: String, required: true, unique: true },
  nombre_asesoria: { type: String, required: true },
});

const asesoriaModel = model("Asesoria", asesoriaSchema);

module.exports = asesoriaModel;
