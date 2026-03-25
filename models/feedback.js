const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  text: String
});

module.exports = mongoose.model("Feedback", feedbackSchema);