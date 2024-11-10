const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AdministradoresSchema = new Schema({
  administrador_id: { type: String, required: true, unique: true },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: "Rol", required: true },
  nombre: { type: String, required: true },
  contrasena: { type: String, required: true },
  contacto: {
    email_admin: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  fecha_registro: { type: Date, default: Date.now },
});

const AdministradoresModel = model("Administradores", AdministradoresSchema);

module.exports = AdministradoresModel;
