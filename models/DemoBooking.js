const mongoose = require("mongoose");

const DemoBookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  classCourse: { type: String, required: true },
  board: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DemoBooking", DemoBookingSchema);
