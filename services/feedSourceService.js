const db = require("../models/configDB.js");

//IMPORTING PARSER SERVICE TO REUSE THE LOOP CAPABILITIES 

const parserService = require("./parser/parserService.js");

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

  //! AUTOMATED MASS HARVEST SYNC CALLED BY CRON EVERY HOUR

  syncAllActiveFeeds: async () => {
    try {
      // CRON LOGGING: NOTIFY CONSOLE THAT ENGINE INITIATED HARVEST
      console.log("🔹 ⏰ [CRON START] FETCHING GLOBAL FEED SITES...");

      const sources = await db.feedSource.findAll({
        attributes: ['id', 'feed_url']
      });

      // CRON LOGGING: RENDER TOTAL CHANNELS DISCOVERED IN CATALOGUE
      console.log(`🔹 🤖 FOUND ${sources.length} CHANNELS TO UPDATE.`);

      for (const source of sources) {
        // CRON LOGGING: ANNOUNCE TARGET CURRENTLY PROCESSING
        console.log(`🔹 📥 SYNCING FEED SOURCE ID: [${source.id}] - LINK: ${source.feed_url}`);

        // REUSE YOUR EXISTING PARSERSERVICE METHOD TO DOWNLOAD AND INSERT NO-DUPLICATE ITEMS
        await parserService.syncArticlesForSource(source.id, source.feed_url);
      }

      // CRON LOGGING: SIGN OFF BATCH COMPLETION STATUS SUCCESS
      console.log("🔹 ✅ [CRON END] ALL SITES UPDATED SUCCESSFULY.");
      return true;
    }
    catch (err) {
      // 🔹 CRON LOGGING: CATCH INTERMEDIATE NETWORK DROPS OR REJECTIONS
      console.error("🔹 💥 [CRON FAILED] PROCESS CRASHED:", err.message);
      throw new Error(err.message);
    }
  },
}


module.exports = feedSourceService;