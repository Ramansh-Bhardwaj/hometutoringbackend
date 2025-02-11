const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");

// ✅ Teacher Registration Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, subject, experience, contact, qualification } = req.body;

    if (!fullName || !subject || !experience || !contact || !qualification) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ contact });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher with this contact already registered" });
    }

    // Save new teacher
    const newTeacher = new Teacher({
      fullName,
      subject,
      experience,
      contact,
      qualification,
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
