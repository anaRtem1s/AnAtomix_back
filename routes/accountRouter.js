// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const accountController = require("../controllers/accountController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");
const authValidator = require ("../validators/authValidator.js");

const accountRouter = require("express").Router();


// !http://localhost:PORT/api/accounts 


accountRouter.route('/')

  // DISPLAY ALL ACCOUNTS

  .get(authentication(), roleAuthorization(['admin']), accountController.getAll)


accountRouter.route('/:id')

  // DISPLAY ONE ACCOUNT BY THEIR ID 

  .get(authentication(), roleAuthorization(['admin', 'self']), accountController.getById) // OK - authentication needs to happen BEFORE roleauthorization

  // DELETE ONE ACCOUNT BY THEIR ID 

  .delete(authentication(), roleAuthorization(['admin', 'self']), accountController.delete) // OK


accountRouter.route('/:id/update')

  // UPDATE ONE ACCOUNT 

  .patch(authentication(), roleAuthorization(['admin', 'self']), authValidator.validateUpdateAccountForm, accountController.update) // Takes a body {username,email, password} 


accountRouter.route('/:id/deactivate')

  // DEACTIVATE ONE ACCOUNT (REVERSIBLE BLOCK)  (ADMIN ONLY)

  .patch(authentication(), roleAuthorization(['admin']), accountController.deactivate) // OK


accountRouter.route('/:id/reactivate')

  // REACTIVATE ONE ACCOUNT (REVERSIBLE BLOCK) (ADMIN ONLY)

  .patch(authentication(), roleAuthorization(['admin']), accountController.reactivate) // OK



module.exports = accountRouter;










