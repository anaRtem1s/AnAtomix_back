// Importing Express.js 

const express = require('express');

// Creating Express server

const app = express();

// Launching server on port (localhost)

app.listen(8080, () => {
    console.log('🖥️ Express API server launched on port 8080 🖥️');
    console.log('http://localhost:8080/');
})