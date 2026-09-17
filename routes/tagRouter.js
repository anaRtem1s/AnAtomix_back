// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const tagController = require("../controllers/tagController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");

//! TO DO + ADD TO ROUTES
// const tagValidator = require("../validators/tagValidator.js");

const tagRouter = require("express").Router();

//? http://localhost:PORT/api/tags

tagRouter.route('/')

  // LIST ALL TAGS
  .get(authentication(), roleAuthorization(['member','admin']), tagController.getAll)

  // CREATE A TAG
  .post(authentication(), roleAuthorization(['member','admin']), tagController.create)

//? http://localhost:PORT/api/tags/:id

tagRouter.route('/:id')

  // GET A TAG
  .get(authentication(), roleAuthorization(['member','admin']), tagController.getById)

  // UPDATE A TAG
  .patch(authentication(), roleAuthorization(['member','admin']), tagController.update)

  // DELETE A TAG
  .delete(authentication(), roleAuthorization(['member','admin']), tagController.delete);

module.exports = tagRouter;




