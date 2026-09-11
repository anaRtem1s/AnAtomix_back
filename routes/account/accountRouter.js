// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const accountController = require("../../controllers/account/accountController.js");
const authentication = require("../../middlewares/auth/authMiddleware.js");
const roleAuthorization = require("../../middlewares/auth/roleMiddleware.js");

const accountRouter = require("express").Router();

accountRouter.route('/')

// DISPLAY ALL ACCOUNTS

// !http://localhost:PORT/api/accounts

.get(authentication(), accountController.getAll)


accountRouter.route('/:id')

// DISPLAY ONE ACCOUNT BY THEIR ID

.get(authentication(), accountController.getById)

// DELETE ONE ACCOUNT BY THEIR ID

.delete(authentication(), roleAuthorization(['admin']), accountController.delete) // authentication needs to happen BEFORE roleauthorization


// DEACTIVATE ONE ACCOUNT (REVERSIBLE BLOCK) - ADMIN ONLY

accountRouter.route('/:id/deactivate')
.patch(authentication(), roleAuthorization(['admin']), accountController.deactivate)

// REACTIVATE ONE ACCOUNT - ADMIN ONLY

accountRouter.route('/:id/reactivate')
.patch(authentication(), roleAuthorization(['admin']), accountController.reactivate)


module.exports = accountRouter;













