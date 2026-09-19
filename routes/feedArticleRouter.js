// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const feedArticleController = require("../controllers/feedArticleController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");

const feedArticleValidator = require("../validators/feedArticleValidator.js");

const feedArticleRouter = require("express").Router();

//? http://localhost:PORT/api/feed_articles

feedArticleRouter.route('/')

  // LIST ALL FEED ARTICLES

  .get(authentication(), roleAuthorization(['member', 'admin']), feedArticleController.getAll)

  // CREATE A FEED ARTICLE

  .post(authentication(), roleAuthorization(['admin']), feedArticleValidator.validateCreateFeedArticle, feedArticleController.create)

//? http://localhost:PORT/api/feed_articles/:id

feedArticleRouter.route('/:id')

  // GET A FEED ARTICLE BY ITS ID

  .get(authentication(), roleAuthorization(['member', 'admin']), feedArticleController.getById)

  // UPDATE A FEED ARTICLE (ADMIN ONLY, TESTING)

  .patch(authentication(), roleAuthorization(['admin']), feedArticleValidator.validateUpdateFeedArticle, feedArticleController.update)



module.exports = feedArticleRouter;