const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const sendEmail = require("../utlis/email"); // ✅ Corrected Import Path

// ✅ Teacher Registration Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, subject, experience, contact, qualification } = req.body;

    if (!fullName || !subject || !experience || !contact || !qualification) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Convert experience to a number
    const experienceYears = Number(experience);
    if (isNaN(experienceYears) || experienceYears < 0) {
      return res.status(400).json({ error: "Invalid experience value" });
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
      experience: experienceYears,
      contact,
      qualification,
    });

    await newTeacher.save();

    // 📩 Send Email Notification to Admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "New Teacher Registration",
        'A new teacher has registered!\n\nName: ${fullName}\nSubject: ${subject}\nExperience: ${experienceYears} years\nContact: ${contact}\nQualification: ${qualification}'
      );
      console.log('📩 Email notification sent to admin: ${process.env.ADMIN_EMAIL}');
    } catch (emailError) {
      console.error("❌ Email Notification Failed:", emailError.message);
    }

    res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;