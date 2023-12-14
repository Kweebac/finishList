const mongoose = require("mongoose");

const finishSchema = new mongoose.Schema({
  cosmetic: {
    type: String,
    required: true,
  },
  finishing: {
    type: String,
    required: true,
  },
  players: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "player",
      required: true,
    },
  ],
});
finishSchema.virtual("url").get(function () {
  return `/finishes/${this._id}`;
});
finishSchema.virtual("name").get(function () {
  return `${this.finishing} ${this.cosmetic}`;
});

module.exports = mongoose.model("finish", finishSchema);
