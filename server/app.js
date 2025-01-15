require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/authRouter');
const app = express();
const mongoUrl = process.env.MONGO_DB_URI;
const db = mongoose.connect(mongoUrl);


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],

    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Credentials', 'Authorization', 'x-correlation-id'],
    credentials: true // mandoatory for google auths
}));

app.use('/api', authRouter);

app.listen(3000, (err, client) => {
    if (err) return console.log('Server not connected: ', err);
    console.log("Server is connected at PORT: 3000");
    if (db) {
        console.log('MongoDB is connected');
    }
})