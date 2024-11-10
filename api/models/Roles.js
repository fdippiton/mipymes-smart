const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RolesSchema = new Schema({
  descripcion: { type: String, required: true },
});

const RolesModel = model("Roles", RolesSchema);

module.exports = RolesModel;
