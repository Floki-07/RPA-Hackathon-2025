require('dotenv').config();
const express = require('express');
const router = express.Router()
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/UserModel');
const Admin = require('../models/AdminModel');
const JWT_SECRET = process.env.JWT_SECRET;



router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Find user
        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        console.log(validPassword);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create and send JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.get('/faculties',authenticateToken, async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculties' });
    }
});

// Submit feedback for a faculty
router.post('/feedback/faculty/:facultyId', authenticateToken, async (req, res) => {
    try {
        const {
            rating,
            comments
        } = req.body;

        // Check if user has already submitted feedback for this faculty
        const existingFeedback = await Feedback.findOne({
            facultyId: req.params.facultyId,
            userId: req.user._id
        });

        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already submitted feedback for this faculty' });
        }

        const feedback = new Feedback({
            facultyId: req.params.facultyId,
            userId: req.user._id,
            rating,
            comments
        });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});
// Protected route example
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user.userId });
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create and send JWT with admin flag
        const token = jwt.sign(
            { userId: admin._id, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Create initial admin user (run this once)
const createAdminUser = async () => {
    try {
        const adminExists = await Admin.findOne({ email: 'admin@example.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new Admin({
                email: 'admin@example.com',
                password: hashedPassword
            });
            await admin.save();
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = router;