const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  discord: String,
  finishes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "finish",
      required: true,
    },
  ],
});

module.exports = mongoose.model("player", playerSchema);
