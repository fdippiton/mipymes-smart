const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AsesoriasSchema = new Schema({
  nombre_asesoria: { type: String, required: true },
  descripcion_asesoria: { type: String, required: true },
});

const AsesoriasModel = model("Asesorias", AsesoriasSchema);

module.exports = AsesoriasModel;

// Formato de registros
// {
//   "_id": {
//     "$oid": "6730deff69ee0aede0f44c21"
//   },

//   "nombre_asesoria": "Asesoría Empresarial",
//   "descripcion_asesoria": ""
// }
