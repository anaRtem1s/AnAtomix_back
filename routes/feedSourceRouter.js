// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const feedSourceController = require("../controllers/feedSourceController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");

const feedSourceValidator = require('../validators/feedSourceValidator.js');

const feedSourceRouter = require("express").Router();

//? http://localhost:PORT/api/feed_sources

feedSourceRouter.route('/')

  // LIST ALL FEED SOURCES (PUBLIC CATALOGUE)

  .get(authentication(), roleAuthorization(['member', 'admin']), feedSourceController.getAll)

  // ADD A NEW FEED SOURCE (PUBLIC CATALOGUE)

  .post(authentication(), roleAuthorization(['member', 'admin']), feedSourceValidator.validateCreateFeedSource, feedSourceController.create)

//? http://localhost:PORT/api/feed_sources/:id

feedSourceRouter.route('/:id')

  // GET A FEED SOURCE BY ID

  .get(authentication(), roleAuthorization(['member', 'admin']), feedSourceController.getById)

  // DELETE A FEED SOURCE BY ID (ADMIN ONLY)

  .delete(authentication(), roleAuthorization(['admin']), feedSourceController.delete)

  // UPDATE A FEED SOURCE (ADMIN ONLY - METADATA)

  .patch(authentication(), roleAuthorization(['admin']), feedSourceValidator.validateUpdateFeedSource, feedSourceController.update)

module.exports = feedSourceRouter;