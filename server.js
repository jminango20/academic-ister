require('dotenv').config();
const express = require('express');
const initializeDatabase = require('../nodejs-smartcontract/src/resources/initializeDB');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
    await initializeDatabase(); // Ensure the table is created

    // Import routes
    const academicRoutes = require("../nodejs-smartcontract/src/routes/academicRoutes");
    const factoryRoutes = require("../nodejs-smartcontract/src/routes/factoryRoutes");

    // Use routes
    app.use('/api/academic', academicRoutes);
    app.use('/api/factory', factoryRoutes);
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
