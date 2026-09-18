const db = require("../models/configDB.js");

const subscriptionService = {

  // FIND ALL subscriptionS

  getAll: async (account_id) => {
    try {
      const subscriptions = await db.subscription.findAll({
        attributes: ['id', 'subscribed_at', 'account_id', 'feed_source_id', 'category_id'], // Columns to return
        where: { account_id: account_id } // Filter condition
      });
      return subscriptions;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND ONE subscription BY ID

  getById: async (id) => {
    try {
      const subscriptionFound = await db.subscription.findByPk(id,
        { attributes: ['id', 'subscribed_at', 'account_id', 'feed_source_id', 'category_id'] });
      return subscriptionFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // CREATE A subscription

  create: async (subscriptionToCreate) => {
    try {

      const subscriptionCreated = await db.subscription.create(subscriptionToCreate);

      return subscriptionCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },


  // DELETE A subscription

  delete: async (id) => {
    try {
      const deletedRow = await db.subscription.destroy({ where: { id } });

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

  // UPDATE A subscription (TITLE, COLOR)

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.subscription.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = subscriptionService;