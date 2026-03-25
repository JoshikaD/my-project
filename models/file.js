const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String
});

module.exports = mongoose.model("File", fileSchema);