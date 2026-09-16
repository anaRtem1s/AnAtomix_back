const db = require("../../models/configDB.js");

const feedSourceService = {

  //! TO TEST FIND ALL FEED SOURCES (CATALOGUE GLOBAL)

  getAll: async () => {
    try {
      const feedSources = await db.feedSource.findAll(
        { attributes: ['id', 'feed_url', 'site_url', 'title', 'description', 'feed_type', 'active'] });

      return feedSources;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND ONE FEED SOURCE BY ID

  getById: async (id) => {
    try {

      const feedSourceFound = await db.feedSource.findByPk(id, { attributes: ['id', 'feed_url', 'site_url', 'title', 'description', 'feed_type', 'active', 'last_fetched_at'] });
      
      return feedSourceFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },


  // CREATE A NEW FEED SOURCE

  async create(data) {
    const feedSource = await db.feedSource.create({
      feed_url: data.feed_url,
      site_url: data.site_url || null,
      title: data.title,
      description: data.description || null,
      feed_type: data.feed_type || 'rss',
      active: true,
      fetch_error_count: 0
    });

    return feedSource;
  },

  // DELETE FEED SOURCE

  delete: async (id) => {
    try {
      const [deletedRow] = await db.feedSource.destroy({ where: { id } });

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