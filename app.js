// Using port defined in own environment variable

const {PORT} = process.env;

// Importing Express.js 

const express = require('express');

// Creating Express server

const app = express();

// Launching server on localhost port

app.listen(PORT, () => {
    console.log('🖥️ Express API server launched on port 8080 🖥️');
    console.log(`http://localhost:${PORT}/api`);
})