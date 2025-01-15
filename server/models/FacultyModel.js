
const mongoose = require('mongoose');
const facultySchema = new mongoose.Schema({
    name: String,
    department: String
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;