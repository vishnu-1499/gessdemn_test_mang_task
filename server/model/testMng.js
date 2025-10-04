const mongoose = require("mongoose");
const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Test_Mang", testSchema);
