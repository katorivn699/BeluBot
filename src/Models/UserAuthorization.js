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
  accessToken: {
    type: String,
  },
  expireAt: {
    type: Date
  }
});

module.exports = model("UserAuthorization", userAuthorizationSchema);
