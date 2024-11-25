const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config({path: "backend/config/config.env"});


const app = express();


// Connect Database
connectDB();

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,               // Allow credentials
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointment',require('./routes/appointmentRoutes'));
app.use('/api/attendant',require('./routes/attendantRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
app.use("/api/realtime", require("./routes/realtimeRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

