const { Schema, model } = require("mongoose");

const defaultRoleSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
});

module.exports = model("DefaultRole", defaultRoleSchema);
