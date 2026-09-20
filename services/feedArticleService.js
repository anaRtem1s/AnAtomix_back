const db = require("../models/configDB.js");

const feedArticleService = {

  // FIND ALL FEED ARTICLES LINKED TO ACCOUNT SUBSCRIPTIONS

  getAll: async (account_id) => {
    try {

      // FILTERS ARTICLES BY JOINING THE SUBSCRIPTION TABLE LINKED TO THE ACTIVE ACCOUNT ID

      const feedArticles = await db.feedArticle.findAll({
        attributes: ['id', 'guid', 'link', 'title', 'summary', 'content_html', 'author', 'published_at', 'updated_at', 'feed_source_id'], // Columns to return
        order: [['published_at', 'DESC']], // SHOWS THE NEWEST FIRST
        include: [
          {
            model: db.feedSource,
            required: true, // ENFORCES AN INNER JOIN TO WEBSITE
            attributes: ['id', 'feed_url', 'feed_type', 'title', 'descr', 'site_url'],
            include: [{
              model: db.subscription,
              required: true, // BACKGROUND CRON ENTRIES ARE AUTO-FILTERED OUT BY THE DB ENGINE
              where: { account_id: account_id }, // FILTER STRICKLY BY LOGGED IN ACCOUNT
              attributes: ['category_id'] // FORCE SEQUELIZE TO RETURN THE ACTIVE CATEGORY ID 
            }]
          },
          // 🔹 FIX: INCLUDE THE INTERACTION RECORD ASSIGNED TO THIS UNIQUE ACCOUNT SPECIFICALLY
          {
            model: db.accountArticle,
            required: false, // PREVENTS FILTERING OUT NEWLY HARVESTED UNREAD ITEMS
            where: { account_id: account_id },
            attributes: ['is_favorite', 'read_at']
          }
        ]
      });

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
