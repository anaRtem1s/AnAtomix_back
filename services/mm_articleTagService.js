const db = require("../models/configDB.js");

const tagService = require("../services/tagService.js");

const mm_articleTagService = {

  getArticleTags: async (account_id) => {
    try {
      // Find tags associated with the article, filtered by user ownership
      const articleTags = await db.articleTag.findAll({
        where: { account_id: account_id }
      });
      return articleTags;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getArticleTagsByArticleId: async (account_id, article_id) => {
    try {
      // join the actual tag rows for this article 
      const articleTags = await db.articleTag.findAll({
        where: { account_id: account_id, article_id: article_id },
        include: [{ model: db.tag }] 
      });
      return articleTags;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getArticleTagsByTagId: async (account_id, tag_id) => {
    try {
      // join the actual article rows for this tag 
      const articleTags = await db.articleTag.findAll({
        where: { account_id: account_id, tag_id: tag_id },
        include: [{ model: db.feedArticle }]
      });
      return articleTags;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  getArticleTag: async (account_id, article_id, tag_id) => {
    try {
      // Find tags associated with the article, filtered by user ownership
      const articleTag = await db.articleTag.findOne({
        where: { account_id: account_id, article_id: article_id, tag_id: tag_id }
      });
      return articleTag;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  createArticleTag: async (account_id, article_id, tag_id) => {
    try {
      const createdArticleTag = await db.articleTag.create({
        account_id: account_id, article_id: article_id, tag_id: tag_id
      });
      return createdArticleTag;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  deleteArticleTag: async (account_id, article_id, tag_id) => {
    try {
      const destroyedRows = await db.articleTag.destroy({
        where: { account_id: account_id, article_id: article_id, tag_id: tag_id }
      });
      return destroyedRows === 1;
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

module.exports = mm_articleTagService;