const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "review", "completed"],
    default: "not_started",
  },
  deadline: {
    type: Date,
    required: true,
  },
  assignedTime: {
    type: Date,
    required: true,
  },
  assigner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true, 
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true, 
  },
  support: {
    type: Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến model User
    required: false, // Người hỗ trợ, tùy chọn
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Task", taskSchema);