const express = require("express");
const DemoRequest = require("../models/DemoBooking");
const sendEmail = require("../utlis/email"); // ✅ Import Email Utility

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

    // 📩 *Send Email Notification to Admin*
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "New Demo Class Request",
          'A new demo class request has been received!\n\nName: ${fullName}\nClass/Course: ${classCourse}\nBoard: ${board}\nContact: ${contact}\nEmail: ${email}\nClass Type: ${classType}'
        );
        console.log('📩 Email notification sent to admin: ${process.env.ADMIN_EMAIL}');
      } catch (emailError) {
        console.error("❌ Email Notification Failed:", emailError.message);
      }
    } else {
      console.warn("⚠️ ADMIN_EMAIL is not set in .env file.");
    }

    res.status(201).json({ message: "Demo request submitted successfully!" });
  } catch (error) {
    console.error("❌ Error booking demo class:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;