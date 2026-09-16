// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const categoryController = require("../controllers/categoryController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");
const categoryValidator = require("../validators/categoryValidator.js");

const categoryRouter = require("express").Router();


categoryRouter.route('/')

  // LIST ALL CATEGORIES OF ACCOUNT (belongs to the account in URL)
  //! GET	/api/accounts/:id/categories	
  .get(

    authentication(),
    roleAuthorization(['self', 'admin']),
    categoryController.getAll
  )

  // CREATE ONE CATEGORY OF ACCOUNT (belongs to the account in URL)
  //! POST	/api/accounts/:id/categories	
  .post(
    authentication(),
    roleAuthorization(['self', 'admin']),
    categoryValidator.validateCreateCategory,
    categoryController.create
  );



categoryRouter.route('/:categoryId')

  // GET ONE CATEGORY OF ACCOUNT (belongs to the account in URL) (ownership checked in service)
  //! GET	/api/accounts/:id/categories/:categoryId	
  .get(
    authentication(),
    roleAuthorization(['self', 'admin']),
    categoryController.getById
  )

  // UPDATE ONE CATEGORY OF ACCOUNT (belongs to the account in URL) (ownership checked in service)
  //! PATCH	/api/accounts/:id/categories/:categoryId
  .patch(
    authentication(),
    roleAuthorization(['self', 'admin']),
    categoryValidator.validateUpdateCategory,
    categoryController.update
  )

  // DELETE ONE CATEGORY OF ACCOUNT (belongs to the account in URL) (ownership checked in service)
  //! DELETE / api / accounts /: id / categories /:categoryId	
  .delete(
    authentication(),
    roleAuthorization(['self', 'admin']),
    categoryController.delete
  );

module.exports = categoryRouter;





