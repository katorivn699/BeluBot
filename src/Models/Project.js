const { Schema, model } = require("mongoose");

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = model('Project', projectSchema);