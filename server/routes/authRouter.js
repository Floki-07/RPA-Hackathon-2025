require('dotenv').config();
const express = require('express');
const router = express.Router()
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/UserModel');
const Admin = require('../models/AdminModel');
const Faculty = require('../models/FacultyModel');
const Feedback = require('../models/FeedbackModel');
const Course = require('../models/CourseModel');
const JWT_SECRET = process.env.JWT_SECRET;
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');


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

router.get('/getuser',authenticateToken, async (req, res) => {
    try {
        let user = await User.findOne({_id:req.userId}).select('-password');
        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculties' });
    }
});
router.get('/faculties',authenticateToken, async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculties' });
    }
});
router.get('/courses',authenticateToken, async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculties' });
    }
});

router.get('/feedback/user/submitted', authenticateToken, async (req, res) => {

    try {   
        const feedbacks = await Feedback.find({ userId: req.userId });
        res.status(200).json(feedbacks);
        console.log(feedbacks);
        
    } catch (error) {   
        res.status(500).json({ message: 'Error fetching feedbacks' });
    }   
});


// Submit feedback for a faculty
router.post('/feedback/course/:courseId', authenticateToken, async (req, res) => {
    try {
        const {
            rating,
            comment
        } = req.body;
        console.log(rating,comment,req.params.courseId);
        
        // Check if user has already submitted feedback for this faculty
        const existingFeedback = await Feedback.findOne({
            courseId: req.params.courseId,
            userId: req.userId
        });


        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already submitted feedback for this faculty' });
        }
        let course = await Course.findOne({_id:req.params.courseId});
        console.log(course);
        const feedback = new Feedback({
            courseId: req.params.courseId,
            userId: req.userId,
            rating,
            feedbacktype: 'course',
            comments:comment
        });
        await feedback.save();

        course.feedbacks.push(feedback._id);
        await course.save();
       
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});
router.post('/feedback/faculty/:facultyId', authenticateToken, async (req, res) => {
    try {
        const { rating, comments } = req.body;
        console.log(req.userId);
        
        // Validate rating (ensure it's within a valid range)
        

        // Check if the faculty exists
        const faculty = await Faculty.findById(req.params.facultyId);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Check if user has already submitted feedback for this faculty
        const existingFeedback = await Feedback.findOne({
            facultyId: req.params.facultyId,
            userId: req.userId,
        });

        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already submitted feedback for this faculty' });
        }

        // Create and save the feedback
        const feedback = new Feedback({
            facultyId: req.params.facultyId,
            userId: req.userId,
            rating,
            comments,
            feedbacktype: 'faculty',
        });
        await feedback.save();

        // Add feedback to the faculty's feedbacks array and save
        faculty.feedbacks.push(feedback._id);
        await faculty.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
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


//admin faculty management
router.post('/admin/addfaculty', async (req, res) => {
    try {
        const { name, department } = req.body;
        console.log(name,department);
       let newfaculty = new Faculty({name,department});
        await newfaculty.save();
        res.status(200).json({ message: 'Faculty added successfully' });      
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
router.get('/admin/allfaculties', async (req, res) => {
    try {
        const faculties = await Faculty.find();
        res.status(200).json({ faculties ,message: 'All faculties found' });      
    } catch (error) {
        res.status(500).json({ message: 'Cannot fetch' });
    }
});
router.delete('/admin/deletefaculty/:id', async (req, res) => {
    try {
        const faculty = await Faculty.findOneAndDelete({_id:req.params.id});
        res.status(200).json({ faculty ,message: `${faculty?.name} deleted successfully` });      
    } catch (error) {
        res.status(500).json({ message: 'Cannot fetch' });
    }
});


//admin course management
router.post('/admin/courses', async (req, res) => {
    try {
        const { name, courseCode, department } = req.body;
        console.log(name,  courseCode, department);
        let newCourse = new Course({
            name,
            courseCode,
            department
        });
        await newCourse.save();
        res.status(200).json({ message: 'Course added successfully' });      
    } catch (error) {
        res.status(500).json({ message: 'Error adding course' });
    }
});

router.get('/admin/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);      
    } catch (error) {
        res.status(500).json({ message: 'Cannot fetch courses' });
    }
});

router.delete('/admin/courses/:id', async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({_id: req.params.id});
        res.status(200).json({ course, message: `${course?.name} deleted successfully` });      
    } catch (error) {
        res.status(500).json({ message: 'Cannot delete course' });
    }
});


router.get('/admin/course/feedback/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch the feedbacks for the course
        const feedbacks = await Feedback.find({ courseId: req.params.id });

        // Prepare feedback data for Excel
        const feedbackData = feedbacks.map((feedback, index) => ({
            'CommentsReview': feedback.comments,
            'AI Prediction':'',
            'Confidence Score':'',
        }));


        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(feedbackData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Define the file path
        // \Desktop\RPA Project\excel
        const folderPath = path.join('C:', 'Users', 'LENOVO', 'Desktop', 'RPA Project', 'excel');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Create the directory if it doesn't exist
        }
        const filePath = path.join(folderPath, `${course.name}_Feedback_Report.xlsx`);

        // Write the Excel file to the specified location
        XLSX.writeFile(wb, filePath);

        // Respond with success message
        res.status(200).json({
            message: 'Feedback report generated successfully',
            filePath
        });        
    } catch (error) {
        res.status(500).json({ message: 'Error in finding feedbacks course' });
    }
});

router.get('/admin/faculty/feedback/:id', async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Fetch the feedbacks for the course
        const feedbacks = await Feedback.find({ facultyId: req.params.id });
        console.log(feedbacks)
        // Prepare feedback data for Excel
        const feedbackData = feedbacks.map((feedback, index) => ({
            'CommentsReview': feedback.comments,
            'AI Prediction':'',
            'Confidence Score':'',
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(feedbackData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Define the file path
        const folderPath = path.join('C:', 'Users', 'LENOVO', 'Desktop', 'RPA Project', 'excel');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Create the directory if it doesn't exist
        }
        const filePath = path.join(folderPath, `${faculty.name}_Feedback_Report.xlsx`);

        // Write the Excel file to the specified location
        XLSX.writeFile(wb, filePath);

        // Respond with success message
        res.status(200).json({
            message: 'Feedback report generated successfully',
            filePath
        });        
    } catch (error) {
        res.status(500).json({ message: 'Error in finding feedbacks course' });
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

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.userId=user.userId;
        next();
    });
}

module.exports = router;