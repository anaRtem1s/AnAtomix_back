// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT: ROUTE (= INDEX.JS)

const mm_articleTagController = require("../controllers/mm_articleTagController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddleware.js");

const mm_articleTagValidator = require("../validators/mm_articleTagValidator.js");

const mm_articleTagRouter = require("express").Router();

//  USER STATE INTERACTION ENDPOINTS (TAG ON ARTICLE MANAGEMENT)

//? http://localhost:PORT/api/article_tags/

mm_articleTagRouter.route('/')
.get(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.getArticleTags);

//? http://localhost:PORT/api/article_tags/tags/:article_id

mm_articleTagRouter.route('/tags/:article_id')
.get(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.getArticleTagsByArticleId);

//? http://localhost:PORT/api/article_tags/articles/:tag_id

mm_articleTagRouter.route('/articles/:tag_id')
.get(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.getArticleTagsByTagId);

//? http://localhost:PORT/api/article_tags/:article_id/:tag_id

mm_articleTagRouter.route('/:article_id/:tag_id')
.get(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.getArticleTag)
.post(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.createArticleTag)
.delete(authentication(), roleAuthorization(['member', 'admin']), mm_articleTagController.deleteArticleTag);

module.exports = mm_articleTagRouter;


