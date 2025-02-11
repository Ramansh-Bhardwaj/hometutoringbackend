const express = require("express");
const DemoRequest = require("../models/DemoBooking");

const router = express.Router();

// 📌 Route to handle demo class form submission
router.post("/book-demo", async (req, res) => {
  try {
    const { fullName, classCourse, board, contact, email, classType } = req.body;

    // ✅ Validate input
    if (!fullName || !classCourse || !board || !contact || !email || !classType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Save the demo request in MongoDB
    const newDemo = new DemoRequest({ fullName, classCourse, board, contact, email, classType });
    await newDemo.save();

    res.status(201).json({ message: "Demo request submitted successfully!" });
  } catch (error) {
    console.error("❌ Error booking demo class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
