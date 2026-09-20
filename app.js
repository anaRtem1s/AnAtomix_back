// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::: MAIN APP :::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 


// USING PORT DEFINED IN ENV VARIABLE

const { PORT } = process.env;

// IMPORTING EXPRESS.JS && CORS

const express = require('express');

const cors = require('cors');


// CREATING EXPRESS WEB SERVER

const app = express();


// ENABLING CORS FOR VITE / REACT (CLIENT)

//!origin: process.env.REACT_APP_API_URL ||

app.use(cors({ origin: 'http://localhost:5173' }));

// MIDDLEWARE TO GET .JSON RESPONSES (strings from body [usr input in the front-end] are translated into jSON to be readable)

app.use(express.json());

// CLIENT FONT

const path = require('path');
app.use('/fonts', express.static(path.join(__dirname, '../client/src/assets/fonts')));

// JSDOC SWAGGER

const expressJSDocSwagger = require('express-jsdoc-swagger'); // Library
const swaggerOption = require('./swagger.option.js'); // Config
expressJSDocSwagger(app)(swaggerOption); // Connection to the app

// ------------ DATABASE CONFIGURATION ------------

const db = require('./models/configDB.js');

// SEQUELIZE CONNECTION WITH THE CONFIGURATION PUT IN THE DB

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ DB Connection - Success');
    })
    .catch((err) => {
        console.log('❌ DB Connection : Fail');
        console.log(err);
    })

// ------------ DATABASE SYNCHRONIZATION ------------

// SYNCHRONIZING SEQUELIZE WITH THE DATABASE

db.sequelize.sync();

//! ONLY IF DB REBUILD IS NEEDED => WILL DESTROY DB :)

//  db.sequelize.sync( { force : true} );


// ROUTER

const router = require("./routes");
app.use('/api', router);

// CRON SERVICE

require('./services/refresh/cronService.js');

// LAUNCHING SERVER ON LOCALHOST PORT

app.listen(PORT, () => {
    console.log(`🖥️ Express API server launched on port ${PORT} 🖥️`);
    console.log(`http://localhost:${PORT}/api`);
})