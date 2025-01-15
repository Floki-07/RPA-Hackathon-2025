const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }]
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;