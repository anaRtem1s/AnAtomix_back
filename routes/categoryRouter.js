// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const categoryController = require("../controllers/categoryController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddlewareOLD.js");

const categoryValidator = require("../validators/categoryValidator.js");

const categoryRouter = require("express").Router();

//? http://localhost:PORT/api/categories/

categoryRouter.route('/')

  // LIST ALL CATEGORIES 
  .get(authentication(), roleAuthorization(['member','admin']), categoryController.getAll)

  // CREATE A CATEGORY 
  .post(authentication(), roleAuthorization(['member','admin']), categoryValidator.validateCreateCategory, categoryController.create)

//? http://localhost:PORT/api/categories/:id/

categoryRouter.route('/:id')

  // GET A CATEGORY 
  .get(authentication(), roleAuthorization(['member','admin']), categoryController.getById)

  // UPDATE A CATEGORY
  .patch(authentication(), roleAuthorization(['member','admin']), categoryValidator.validateUpdateCategory, categoryController.update)

  // DELETE A CATEGORY 
  .delete(authentication(), roleAuthorization(['member','admin']), categoryController.delete);

module.exports = categoryRouter;





