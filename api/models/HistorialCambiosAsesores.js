const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const HistorialCambiosAsesoresSchema = new Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesores",
    required: true,
  },
  accion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const HistorialCambiosAsesoresModel = model(
  "HistorialCambiosAsesores",
  HistorialCambiosAsesoresSchema
);

module.exports = HistorialCambiosAsesoresModel;
