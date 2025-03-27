const { Schema, model } = require("mongoose");

const mineSchema = new Schema({
  mineId: {
    type: String,
    required: true,
    unique: true,
  },
  mineName: {
    type: String,
    required: true,
  },
  mineDurability: {
    type: Number,
    required: true,
  },
  resources: [
    {
      resourceName: {
        type: String,
        required: true,
      },
      rarity: {
        type: String,
        required: true,
      },
      dropRate: {
        type: Number,
        required: true,
      },
      baseValue: {
        type: Number,
        required: true,
      },
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  lastReset: {
    type: Date,
  },
});

module.exports = model('Mine', mineSchema);
