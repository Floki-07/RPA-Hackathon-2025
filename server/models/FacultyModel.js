
const mongoose = require('mongoose');
const facultySchema = new mongoose.Schema({
    name: String,
    department: String,
    feedbacks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }]
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;