const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true }, // Can be 'teacher' or 'parent'

    // 🔹 Additional fields for teachers
    subjects: { type: [String], default: [] }, // Subjects they teach
    experience: { type: Number, default: 0 }, // Years of experience
    qualifications: { type: String, default: "" }, // Education qualifications
    bio: { type: String, default: "" }, // Short description

    createdAt: { type: Date, default: Date.now }
});

// 🔒 Encrypt Password Before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Compare Password During Login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
