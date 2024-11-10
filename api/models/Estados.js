const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EstadosSchema = new Schema({
  estado_id: { type: String, required: true, unique: true },
  estado_descripcion: { type: String, required: true },
});

const EstadosModel = model("Estados", EstadosSchema);

module.exports = EstadosModel;
