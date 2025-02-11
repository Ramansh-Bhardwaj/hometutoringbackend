const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// ✅ Register User (Signup)
router.post('/register', async (req, res) => {
    const { name, email, password, phoneNumber, role, subjects, experience, qualifications, bio } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Create a new user (include teacher details)
        const user = new User({
            name,
            email,
            password,
            phoneNumber,
            role,
            subjects: role === 'teacher' ? subjects : [],
            experience: role === 'teacher' ? experience : 0,
            qualifications: role === 'teacher' ? qualifications : "",
            bio: role === 'teacher' ? bio : ""
        });

        // Save to database
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;


// ✅ Update Teacher Profile
router.put('/update-profile', authMiddleware, async (req, res) => {
    const { subjects, experience, qualifications, bio } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied!' });
        }

        // Update fields
        user.subjects = subjects || user.subjects;
        user.experience = experience || user.experience;
        user.qualifications = qualifications || user.qualifications;
        user.bio = bio || user.bio;

        await user.save();
        res.json({ message: 'Profile updated successfully!', user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
// ✅ Protected Route (Test)
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: `Welcome, ${req.user.id}! This is a protected route.` });
});
// ✅ Get All Teachers
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
