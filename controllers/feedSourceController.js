const feedSourceService = require("../services/feedSourceService.js");

//? IMPORTING RSS / ATOM PARSER 

const parserService = require("../services/parser/parserService.js");


const feedSourceController = {
  /**
     * Feed source creation form model
     * @typedef {object} FeedSourceCreateForm
     * @property {string} feed_url.required - URL of the feed stream
     * @property {string} feed_type.required - Format type (e.g., Atom / RSS)
     * @property {string} title.required - Title of the feed source
     * @property {string} descr - Optional summary description
     * @property {string} site_url - Optional main website link
     */

  /**
   * Feed source updating form model
   * @typedef {object} FeedSourceUpdateForm
   * @property {string} feed_url - URL of the feed stream
   * @property {string} feed_type - Format type (e.g., Atom / RSS)
   * @property {string} title - Title of the feed source
   * @property {string} descr - Summary description
   * @property {string} site_url - Main website link
   */

  /**
   * Base feed source data structure
   * @typedef {object} FeedSourceDetails
   * @property {number} id - Unique identifier
   * @property {string} feed_url - URL of the feed stream
   * @property {string} feed_type - Format type
   * @property {string} title - Title of the feed source
   * @property {string} descr - Summary description
   * @property {string} site_url - Main website link
   */

  /**
   * Feed source wrapper returned on creation success
   * @typedef {object} FeedSourceCreatedResponse
   * @property {string} message - Success confirmation string
   * @property {FeedSourceDetails} attributes - The created entity profile
   */

  /**
   * Feed source elements returned on update success
   * @typedef {object} FeedSourceUpdatedResponse
   * @property {string} message - Success confirmation string
   * @property {string} id - Target resource record ID
   * @property {string} new_feed_url - Updated feed stream address
   * @property {string} new_feed_type - Updated format standard
   * @property {string} new_title - Updated display name
   * @property {string} new_descr - Updated descriptions value
   * @property {string} new_site_url - Updated base destination URL
   */

  /**
   * Standard message envelope for deletion or simple responses
   * @typedef {object} FeedSourceMessageResponse
   * @property {number} status - HTTP status code matching the header
   * @property {string} message - Operational details
   */

  /**
   * GET /api/feed-sources
   * @summary Get all global feed sources (Catalogue)
   * @tags Feed Sources
   * @security BearerAuth
   * @return {array<FeedSourceDetails>} 200 - List of all feed sources - application/json
   * @return 500 - Internal Server Error
   */

  // GET ALL FEED SOURCES

  getAll: async (req, res) => {
    try {
      const feedSources = await feedSourceService.getAll();
      res.status(200).json(feedSources);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching feed sources list 🐾' + err });
    }
  },

  /**
   * GET /api/feed-sources/{id}
   * @summary Get a specific feed source by its ID
   * @tags Feed Sources
   * @security BearerAuth
   * @param {number} id.path.required - Feed Source ID
   * @return {FeedSourceDetails} 200 - Feed source tracking details - application/json
   * @return 404 - Not Found (resource does not exist)
   * @return 500 - Internal Server Error
   */

  //  GET A FEED SOURCE BY ITS ID

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const feedSource = await feedSourceService.getById(id);

      if (!feedSource) {
        res.status(404).json({ status: 404, message: ` 💥 No feed source with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(feedSource);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching feed source 🐾' + err });
    }
  },

  /**
   * POST /api/feed-sources
   * @summary Create a global shared feed source entry
   * @tags Feed Sources
   * @security BearerAuth
   * @param {FeedSourceCreateForm} request.body.required - Feed initialization payload - application/json
   * @return {FeedSourceCreatedResponse} 200 - Feed source entry recorded - application/json
   * @return 400 - Bad Request (missing required payload attributes)
   * @return 404 - Not Found (internal creation pipeline failure)
   * @return 500 - Internal Server Error
   */


  create: async (req, res) => {
    try {
      const { feed_url } = req.body;

      //? CHECKING MANDATORY FIELDS 
      if (!feed_url) {
        return res.status(400).json({ status: 400, message: '💥 Feed URL is required' });
      }

      // EXTRACT REAL ONLINE METADATA BY PARSING THE LIVE FEED LINK ON THE BACKEND

      const onlineFeedProfile = await parserService.parseURL(feed_url);

      const extractedTitle = onlineFeedProfile.title || "Untitled Feed Source";
      const extractedDescr = onlineFeedProfile.description || null;
      const extractedSiteUrl = onlineFeedProfile.link || null;
      const detectedType = feed_url.toLowerCase().includes('atom') ? 'atom' : 'rss';

      // CALLING SERVICE 

      const feedSourceCreated = await feedSourceService.create({
        feed_url,
        feed_type: detectedType,
        title: extractedTitle,
        descr: extractedDescr,
        site_url: extractedSiteUrl
      });

      if (!feedSourceCreated) {
        return res.status(404).json({ status: 404, message: `💥 Could not create feed source, sorry` });
      }

      // RUN IMMEDATELY FRESH ARTICLES HARVEST SYNCHRONIZATION FROM THE ONLINE LINK XML
      await parserService.syncArticlesForSource(feedSourceCreated.id, feedSourceCreated.feed_url);

      feedSourceCreated.message = 'Feed source created';
      res.status(200).json({ message: '💥 Feed source created!', 'attributes': feedSourceCreated });
    }
    catch (err) {

      // INTERCEPT SEQUELIZE UNIQUE CONSTRAINT EXCEPTION FOR ALREADY REGISTERED FEEDS

      if (err.name === 'SequelizeUniqueConstraintError' || (err.message && err.message.includes('Validation error'))) {
        return res.status(400).json({ status: 400, message: ' 💥 This feed URL is already registered our globalcatalogue!' });
      }

      res.status(500).json({ status: 500, message: 'A server error occured while creating feed source 🐾: ' + err });
    }
  },

  /**
   * DELETE /api/feed-sources/{id}
   * @summary Delete a feed source entry from the global catalogue
   * @tags Feed Sources
   * @security BearerAuth
   * @param {number} id.path.required - Target Feed Source ID
   * @return {FeedSourceMessageResponse} 200 - Feed resource tracking record deleted - application/json
   * @return 404 - Not Found (target record missing or processing error)
   * @return 500 - Internal Server Error
   */

  // DELETE FEED SOURCE

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      // CHECKING IF FEED SOURCE TO DELETE EXISTS IN DB

      const feedSourceToDelete = await feedSourceService.getById(id);

      if (!feedSourceToDelete) {
        return res.status(404).json({ status: 404, message: ` 💥 No feed source with ID ${id}, sorry` })
      }
      else {

        const deleted = await feedSourceService.delete(id);

        if (deleted) {

          // 204 DOES NOT ACCEPT BODY, SO 200 HERE

          res.status(200).json({
            status: 200,
            message: '💥 Feed source deleted successfully, admin'
          });
        }
        else {
          res.status(404).json({
            status: 404,
            message: `💥 Could not delete feed source with ID ${id}, admin`
          });
        }
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while deleting the feed source 🐾' + err });
    }
  },

  /**
   * PATCH /api/feed-sources/{id}
   * @summary Update an active feed source definition
   * @tags Feed Sources
   * @security BearerAuth
   * @param {number} id.path.required - Target Feed Source ID
   * @param {FeedSourceUpdateForm} request.body.required - Target parameter fields to override - application/json
   * @return {FeedSourceUpdatedResponse} 200 - Updated field validation profile - application/json
   * @return 400 - Bad Request (no field variables targeting an change were provided)
   * @return 404 - Not Found (resource target record structure missing)
   * @return 500 - Internal Server Error (database record write modification error)
   */

  // UPDATE A FEED SOURCE

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const feedSource = await feedSourceService.getById(id);

      if (!feedSource) {
        return res.status(404).json({ status: 404, message: ` 💥 No feed source with ID ${id}, sorry` });
      }

      const { feed_url, feed_type, title, descr, site_url } = req.body;

      if (!feed_url && !feed_type && !title && !descr && !site_url) {
        return res.status(400).json({ status: 400, message: '💥 Provide at least one value to update' });
      }

      const new_feed_url = feed_url ?? feedSource.feed_url;
      const new_feed_type = feed_type ?? feedSource.feed_type;
      const new_title = title ?? feedSource.title;
      const new_descr = descr ?? feedSource.descr;
      const new_site_url = site_url ?? feedSource.site_url;

      const updated = await feedSourceService.update(id, { feed_url, feed_type, title, descr, site_url });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `💥 Failed to update feed source with ID ${id}` });
      }

      res.status(200).json({ message: 'Feed source updated', id, new_feed_url, new_feed_type, new_title, new_descr, new_site_url });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the feed source 🐾' + err });
    }
  }
}

module.exports = feedSourceController;