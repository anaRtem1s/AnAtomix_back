// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const feedSourceController = require("../controllers/feedSourceController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddlewareOLD.js");

const feedSourceValidator = require('../validators/feedSourceValidator.js');

const feedSourceRouter = require("express").Router();

//? http://localhost:PORT/api/feed_sources

feedSourceRouter.route('/')
  .get(authentication(), roleAuthorization(['member', 'admin']), feedSourceController.getAll)
  .post(authentication(), roleAuthorization(['member', 'admin']), feedSourceValidator.validateCreateFeedSource, feedSourceController.create)

//? http://localhost:PORT/api/feed_sources/:id

feedSourceRouter.route('/:id')
  .get(authentication(), roleAuthorization(['member', 'admin']), feedSourceController.getById)
  .delete(authentication(), roleAuthorization(['admin']), feedSourceController.delete)
  .patch(authentication(), roleAuthorization(['admin']), feedSourceValidator.validateUpdateFeedSource, feedSourceController.update)

module.exports = feedSourceRouter;