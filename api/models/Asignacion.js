const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const asignacionSchema = new Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  asesor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesor",
    required: true,
  },
  fecha_asignacion: { type: Date, required: true },
});

const asignacionModel = model("Asignacion", asignacionSchema);

module.exports = asignacionModel;
