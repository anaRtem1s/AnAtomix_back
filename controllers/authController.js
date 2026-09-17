// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE AUTHSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES)

const authService = require("../services/auth/authService.js");

// PSSWD HASH TOOL

const argon2 = require('argon2');

// AUTH TOKEN GENERATION TOOL

const jwtUtils = require("../services/auth/utils/jwtUtils");

const authController = {
    /**
    * Account registration form model
    * @typedef {object} RegisterForm
    * @property {string} username.required - Username (unique)
    * @property {string} email.required - Email (unique)
    * @property {string} password.required - Password 
    */

    /**
    * Account login form model
    * @typedef {object} LoginForm
    * @property {string} email - Email (required if username is empty)
    * @property {string} username - Username (required if email is empty)
    * @property {string} password.required - Password
    */

    /**
    * Account info returned on success
    * @typedef {object} AccountInfo
    * @property {number} id
    * @property {string} username
    * @property {string} role
    */

    /**
    * Account logged in, with its token
    * @typedef {object} AccountLogged
    * @property {string} token
    * @property {AccountInfo} account
    */

    /**
    * POST /api/auth/register
    * @summary Create a new account
    * @tags Auth
    * @param {RegisterForm} request.body.required - Registration - application/json
    * @return {AccountInfo} 201 - Account created - application/json
    * @return 400 - Bad Request (missing fields)
    * @return 409 - Conflict (email or username already taken)
    */

    /**
    * POST /api/auth/login
    * @summary Account login (via email OR username)
    * @tags Auth
    * @param {LoginForm} request.body.required - Login - application/json
    * @return {AccountLogged} 200 - Account - application/json
    * @return 400 - Bad Request (missing credentials)
    * @return 401 - Incorrect credentials
    * @return 403 - Account deactivated
    */



    // -------------------------------------- NEW ACCOUNT CREATION - REGISTER --------------------------------------

    register: async (req, res) => {
        try {

            const { username, email, password } = req.body;

            // CHECKING MANDATORY FIELDS 

            if (!username || !email || !password) {
                return res.status(400).json({ status: 400, message: 'Username, email & password are required' });
            }

            // CHECKING IF EMAIL IS NOT ALREADY TAKEN

            if (await authService.emailAlreadyUsed(email)) {
                return res.status(409).json({ status: 409, message: 'This email address is already taken, sorry' });
            }

            // CHECKING IF USERNAME IS NOT ALREADY TAKEN

            if (await authService.usernameAlreadyUsed(username)) {

                // RESPONDING ERROR 409 : CONFLICT

                return res.status(409).json({ status: 409, message: 'This username is already taken, sorry' });
            }

            // ! PSSWD HASH

            const passwordhash = await argon2.hash(password);


            const accountAdded = await authService.insert({
                username,
                email,
                passwordhash
            });

            const { id, role } = accountAdded;

            // 201 : CREATED
            // Here success is reported of account creation, which is fine. But it might be useful to already send back a token so that the user doesn't have to login after registration.
            // There is possibly a good reason not to do this to make sure the user by doing all kinds of stuff in the app forgets the password, and so a login after create might reinforce their memory.
            res.status(201).json({ id, username, email, role });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occurred' });
        }
    },


    // -------------------------------------- LOGIN - CONNECTION --------------------------------------

    login: async (req, res) => {
        try {
            const { email, username, password } = req.body;

            console.log("LOGIN REQUEST:", { email, username, password });

            if ((!email && !username) || !password) {
                return res.status(400).json({ status: 400, message: 'Email OR username, and password, are required' });
            }

            // FIND ACCOUNT BY EMAIL OR USERNAME

            const accountFound = email
                ? await authService.getByEmail(email)
                : await authService.getByUsername(username);

            // IF FOUND  -> CHECK IF DATABASE ID MATCHES PSSWD
            // IF NOT --> ERROR

            if (!accountFound || !(await argon2.verify(accountFound.passwordhash, password))) {
                return res.status(401).json({ status: 401, message: 'Incorrect credentials' });
            }

            // ACCOUNT DEACTIVATED - CONNECTION REFUSED

            if (!accountFound.is_active) {
                return res.status(403).json({ status: 403, message: 'This account has been deactivated' });
            }

            // IF MATCH : SEND BACK INFOS ON ACCOUNT [+ TOKEN]
            // GENERATING TOKEN WITH UTILS FILE
            // The token which is generated contains the account info. You cannot alter this info, since the info is signed by the server.
            // Should you meddle with the token, the server will know and anything done with that token will not be accepted.
            const token = await jwtUtils.generate(accountFound);
            // This token is now send back to the client so that it can be used for all next things the user wants to do via other controllers.
            res.status(200).json({
                token: token,
                account: {
                    id: accountFound.id,
                    username: accountFound.username,
                    role: accountFound.role
                }
            });

        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occurred' });
        }
    }
}

module.exports = authController;

