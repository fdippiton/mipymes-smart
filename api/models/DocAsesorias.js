const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DocAsesoriasSchema = new Schema({
  asesoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesorias",
    required: true,
  },
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clientes",
    required: true,
  },
  asesor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asesores",
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
    { type: mongoose.Schema.Types.ObjectId, ref: "Talleres" },
  ],
  observaciones_adicionales: { type: String },
  estado: { type: String, required: true },
  foto: { type: String },
});

const DocAsesoriasModel = model("DocAsesorias", DocAsesoriasSchema);

module.exports = DocAsesoriasModel;
