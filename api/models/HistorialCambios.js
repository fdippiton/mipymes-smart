const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const HistorialCambiosSchema = new Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Administradores",
    required: true,
  },
  accion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

const HistorialCambiosModel = model("HistorialCambios", HistorialCambiosSchema);

module.exports = HistorialCambiosModel;
