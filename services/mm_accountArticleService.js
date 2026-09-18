// JUNCTION TABLE BETWEEN ACCOUNT & FEED_ARTICLE (M TO M)

const db = require("../models/configDB.js");

const accountArticleService = {

  // FIND ALL READ / LOVED ARTICLE 

  getAll: async (account_id) => {
    try {
      const accountArticles = await db.accountArticle.findAll({
        attributes: ['account_id', 'article_id', 'read_at', 'is_favorite'], // Columns to return
        where: { account_id: account_id } // Filter condition
      });
      return accountArticles;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND ONE READ / LOVED ARTICLE BY ID

  getById: async (account_id,article_id) => {
    try {
      const record = await db.accountArticle.findOne({
        where: { account_id: account_id, article_id: article_id }
      });
      return record;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  // CREATE A READ / LOVED ARTICLE FOR AN ACCOUNT

  create: async (accountArticleToCreate) => {
    try {

      const accountArticleCreated = await db.accountArticle.create(accountArticleToCreate);

      return accountArticleCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },


  // DELETE A  READ / LOVED ARTICLE 

  delete: async (id) => {
    try {
      const deletedRow = await db.accountArticle.destroy({ where: { id } });

      if (deletedRow === 1) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // UPDATE A  READ / LOVED ARTICLE (UN-FAVORITE)

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.accountArticle.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },
  // GET A SINGLE STATUS BY COMPOSITE KEYS (INTERNAL HELPER / REUSE)
  getOne: async (accountId, articleId) => {
    try {
      const readFavouriteStatus = await db.accountArticle.findOne({
        where: { account_id: accountId, article_id: articleId }
      });
      return readFavouriteStatus;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // MARK AS UNREAD (Deletes the record)
  markAsUnread: async (accountId, articleId) => {
    try {
      const destroyedRows = await db.accountArticle.destroy({
        where: { account_id: accountId, article_id: articleId }
      });
      return destroyedRows === 1;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // TOGGLE FAVORITE STATUS (Creates if missing, toggles boolean if exists)
  toggleFavorite: async (accountId, articleId) => {
    try {
      const record = await db.accountArticle.findOne({
        where: { account_id: accountId, article_id: articleId }
      });

      if (record) {
        record.is_favorite = !record.is_favorite;
        await record.save();
        return record;
      } else {

        const newRecord = await db.accountArticle.create({
          account_id: accountId,
          article_id: articleId,
          is_favorite: true,
          read_at: new Date()
        });
        return newRecord;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = accountArticleService;