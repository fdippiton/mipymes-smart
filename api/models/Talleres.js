const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TalleresSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  instructor: { type: String, required: true },
});

const TalleresModel = model("Talleres", TalleresSchema);

module.exports = TalleresModel;
