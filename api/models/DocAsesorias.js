const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DocAsesoriasSchema = new Schema({
  doc_asesoria_id: { type: String, required: true, unique: true },
  asesoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesoria",
    required: true,
  },
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
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  duracion_sesion: { type: String },
  tema_principal: { type: String },
  documentos_compartidos: [{ type: String }],
  temas_tratados: [{ type: String, required: true }],
  objetivos_acordados: { type: String, required: true },
  talleres_recomendados: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Taller" },
  ],
  observaciones_adicionales: { type: String },
  estado: { type: String, required: true },
  foto: { type: String },
});

const DocAsesoriasModel = model("DocAsesorias", DocAsesoriasSchema);

module.exports = DocAsesoriasModel;
