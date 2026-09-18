const db = require("../models/configDB.js");

const feedArticleService = {

  // FIND ALL FEED ARTICLES

  getAll: async () => {
    try {
      const feedArticles = await db.feedArticle.findAll({
        attributes: ['id', 'guid', 'link', 'title', 'summary', 'content_html', 'author', 'published_at', 'updated_at', 'feed_source_id']
      }); // Columns to return

      return feedArticles;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND A FEED ARTICLE BY ID

  getById: async (id) => {
    try {
      const feedArticleFound = await db.feedArticle.findByPk(id,
        { attributes: ['id', 'guid', 'link', 'title', 'summary', 'content_html', 'author', 'published_at', 'updated_at', 'feed_source_id'] });
      return feedArticleFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // CREATE A FEED ARTICLE

  create: async (feedArticleToCreate) => {
    try {

      const feedArticleCreated = await db.feedArticle.create(feedArticleToCreate);

      return feedArticleCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },

  // UPDATE FEED ARTICLE (ADMIN ONLY)

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.feedArticle.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },
}


module.exports = feedArticleService;
