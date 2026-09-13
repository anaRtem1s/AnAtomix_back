// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const accountController = require("../../controllers/account/accountController.js");
const authentication = require("../../middlewares/auth/authMiddleware.js");
const roleAuthorization = require("../../middlewares/auth/roleMiddleware.js");

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


accountRouter.route('/:id/deactivate')

  // DEACTIVATE ONE ACCOUNT (REVERSIBLE BLOCK)  (ADMIN ONLY)

  .patch(authentication(), roleAuthorization(['admin']), accountController.deactivate) // OK

// REACTIVATE ONE ACCOUNT (ADMIN ONLY)

accountRouter.route('/:id/reactivate')
  .patch(authentication(), roleAuthorization(['admin']), accountController.reactivate)


// REACTIVATE ONE ACCOUNT (ADMIN ONLY)

accountRouter.route('/:id/update')
  .patch(authentication(), roleAuthorization(['admin', 'self']), accountController.update) // Takes a body {username,email} //! NEEDS TO GO THROUGH ZOD VALIDATOR LIKE REGISTER AND ALSO FRONT END VAL


module.exports = accountRouter;













