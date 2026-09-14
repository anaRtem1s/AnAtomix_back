// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const authController = require("../../controllers/auth/authController.js");

const authRouter = require("express").Router();

// VALIDATORS

const authValidator = require("../../validators/auth/authValidator.js");

// NEW ACCOUNT REGISTER IN DB REQUEST 

//! http://localhost:PORT/api/auth/register

authRouter.post('/register',  authValidator.validateRegisterForm, authController.register)

// ACCOUNT LOGIN/CONNECTION REQUEST

// ! http://localhost:PORT/api/auth/login

authRouter.post('/login', authValidator.validateLoginForm, authController.login)


module.exports = authRouter;