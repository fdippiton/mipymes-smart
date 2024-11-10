const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AsignacionesSchema = new Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
    unique: true,
  },
  asesor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesor",
    required: true,
  },
  fecha_asignacion: { type: Date, required: true },
});

const AsignacionesModel = model("Asignaciones", AsignacionesSchema);

module.exports = AsignacionesModel;
