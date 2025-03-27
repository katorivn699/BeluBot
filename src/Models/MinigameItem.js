const { Schema, model } = require("mongoose");

const minigameItemSchema = new Schema({
    itemId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    strength: {
        type: Number,
        required: true,
        default: 3
    },
    rarity: {
        type: String,
        required: true
    },
    sellValue: {
        type: Number,
        required: true
    },
    durability: {
        type: Number,
        required: true,
    }
});

module.exports = model('MinigamesItems', minigameItemSchema);