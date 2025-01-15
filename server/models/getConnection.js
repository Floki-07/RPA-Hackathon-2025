const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
    .then(() => console.log('MongoDB is connected'))
    .catch((err) => console.error('Error while connecting to database:', err.message));