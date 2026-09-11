// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const authController = require("../../controllers/auth/authController.js");

const authRouter = require("express").Router();

// NEW ACCOUNT REGISTER IN DB REQUEST 

authRouter.post('/register', authController.register)

// ACCOUNT LOGIN REQUEST 

authRouter.post('/login', authController.login)


module.exports = authRouter;