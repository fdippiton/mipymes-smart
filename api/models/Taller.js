const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tallerSchema = new Schema({
  taller_id: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  instructor: { type: String, required: true },
});

const tallerModel = model("Taller", tallerSchema);

module.exports = tallerModel;
