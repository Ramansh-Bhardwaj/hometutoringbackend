const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true, unique: true },
  qualification: { type: String, required: true },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
