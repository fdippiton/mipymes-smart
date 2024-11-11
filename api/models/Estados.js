const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const EstadosSchema = new Schema({
  estado_descripcion: { type: String, required: true },
});

const EstadosModel = model("Estados", EstadosSchema);

module.exports = EstadosModel;
