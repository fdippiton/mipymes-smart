const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TalleresSchema = new Schema({
  taller_id: { type: String, required: true, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  instructor: { type: String, required: true },
});

const TalleresModel = model("Talleres", TalleresSchema);

module.exports = TalleresModel;