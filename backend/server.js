require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./src/resources/initializeDB');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const startServer = async () => {
    await initializeDatabase(); // Ensure the table is created

    // Import routes
    const academicRoutes = require("./src/routes/academicRoutes");
    const factoryRoutes = require("./src/routes/factoryRoutes");

    // Use routes
    app.use('/api/academic', academicRoutes);
    app.use('/api/factory', factoryRoutes);
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
