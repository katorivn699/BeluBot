const { Schema, model } = require("mongoose");

const userAuthorizationSchema = new Schema({
  userId: {
    type: String,
    require: true,
  },
  guildId: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isLogin: {
    type: Boolean,
    require: true,
  },
});

module.exports = model("UserAuthorization", userAuthorizationSchema);
