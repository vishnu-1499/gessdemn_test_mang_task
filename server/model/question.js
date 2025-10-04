const mongoose = require("mongoose");
const quesSchema = new mongoose.Schema({
  testID: { type: mongoose.Schema.Types.ObjectId, ref: "Test_Mang", required: true },
  quesAns: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      answer: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Q&A", quesSchema);
