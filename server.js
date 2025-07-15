require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {

    // Import routes
    const academicRoutes = require("../nodejs-smartcontract/src/routes/academicRoutes");

    // Use routes
    app.use('/api/academic', academicRoutes);
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
