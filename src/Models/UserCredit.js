const { Schema, model } = require("mongoose");

const userCredit = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  eCredit: {
    type: Number,
    require: true,
  },
  achievements: [{
    type: String, 
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,  
  }
});

module.exports = model('UserCredit', userCredit);