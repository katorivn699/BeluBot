const { Schema, model } = require("mongoose");

const configSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});
const Config = model("Config", configSchema);
module.exports = Config;
