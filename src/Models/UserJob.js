const { Schema } = require("mongoose");

const userJobSchema = new Schema({
  jobName: {
    type: String,
    required: true,
    trim: true,
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  statusReport: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "On Hold"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  }
});

module.exports = mongoose.model('UserJob', userJobSchema);
