// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const mm_accountArticleController = require("../controllers/mm_accountArticleController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");

const mm_accountArticleValidator = require("../validators/mm_accountArticleValidator.js");

const mm_accountArticleRouter = require("express").Router();

//! TEST VALIDATOR

//  USER STATE INTERACTION ENDPOINTS (Read / Favorite Status)

//? http://localhost:PORT/api/account_articles

mm_accountArticleRouter.route('/')

  // LIST ALL ACCOUNT_ARTICLE

  .get(authentication(), roleAuthorization(['member', 'admin']), mm_accountArticleController.getAll)

  // CREATE A ACCOUNT_ARTICLE

  .post(authentication(), roleAuthorization(['member', 'admin']), mm_accountArticleController.create)

//? http://localhost:PORT/api/account_articles/:id

mm_accountArticleRouter.route('/:id')

  // GET A ACCOUNT_ARTICLE

  .get(authentication(), roleAuthorization(['member', 'admin']), mm_accountArticleController.getById)

//? http://localhost:PORT/api/account_articles/:id/favorite

// TOGGLE FAVORITE STATUS

mm_accountArticleRouter.route('/:id/favorite')
  .patch(authentication(), roleAuthorization(['member', 'admin']), mm_accountArticleValidator.validateUpdateArticleInteraction, mm_accountArticleController.toggleFavorite);

//? http://localhost:PORT/api/account_articles/:id/unread

// MARK ARTICLE AS UNREAD

mm_accountArticleRouter.route('/:id/unread')
  .delete(authentication(), roleAuthorization(['member', 'admin']), mm_accountArticleController.markAsUnread);

module.exports = mm_accountArticleRouter;