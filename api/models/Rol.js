const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rolSchema = new Schema({
  rol_id: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
});

const RolModel = model("Rol", RolSchema);

module.exports = RolModel;
