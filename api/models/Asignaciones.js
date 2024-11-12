const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AsignacionesSchema = new Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clientes",
    required: true,
    unique: true,
  },
  asesor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesores",
    required: true,
  },
  fecha_asignacion: { type: Date, default: Date.now },
});

const AsignacionesModel = model("Asignaciones", AsignacionesSchema);

module.exports = AsignacionesModel;
