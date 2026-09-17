const db = require("../models/configDB.js");

const feedSourceService = {

  // FIND ALL FEED SOURCES (GLOBAL CATALOGUE)

  getAll: async () => {
    try {
        const feedSources = await db.feedSource.findAll(
            { attributes: ['id', 'feed_url', 'feed_type', 'title', 'descr', 'site_url'] });
        return feedSources;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND A FEED SOURCE BY ID

  getById: async (id) => {
    try {

      const feedSourceFound = await db.feedSource.findByPk(id, { attributes: ['id', 'feed_url', 'feed_type', 'title', 'descr', 'site_url'] });

      return feedSourceFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },


  // CREATE A FEED SOURCE

  create: async (feedSourceToCreate) => {
    try {

      const feedSourceCreated = await db.feedSource.create(feedSourceToCreate);

      return feedSourceCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },


  // DELETE FEED SOURCE

  delete: async (id) => {
    try {
      const deletedRow = await db.feedSource.destroy({ where: { id } });

      if (deletedRow === 1) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (err) {
      throw err;
    }
  },

  // UPDATE FEED SOURCE STATUS

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.feedSource.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },
}

module.exports = feedSourceService;