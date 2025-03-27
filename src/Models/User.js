const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: "/default-avatar.png",
    },
  },
  { timestamps: false }
);

const User = model("User", userSchema);

module.exports = User;
