const feedArticleService = require("../services/feedArticleService.js");

const feedArticleController = {
  /**
   * Feed article creation form model
   * @typedef {object} FeedArticleCreateForm
   * @property {string} guid.required - Unique identifier string from the RSS/Atom stream source
   * @property {string} link.required - Original web URL address link for the article content
   * @property {string} title.required - Article title header standard
   * @property {string} summary - Article short description excerpt snippet
   * @property {string} content_html - Full formatted HTML body content of the feed article
   * @property {string} author - Name string of the article writer
   * @property {string} published_at - Publication datetime string standard
   * @property {string} updated_at - Update datetime string standard
   * @property {number} feed_source_id.required - Parent catalog index feed stream tracking ID
   */

  /**
   * Feed article update form model (Administrative targets only)
   * @typedef {object} FeedArticleUpdateForm
   * @property {string} link - Overriding web URL address link element
   * @property {string} title - Overriding custom title configuration string
   * @property {number} feed_source_id - Overriding target parent source connection index ID
   */

  /**
   * Base feed article record layout
   * @typedef {object} FeedArticleDetails
   * @property {number} id - Unique identifier
   * @property {number} account_id - Owner account ID mapping
   * @property {string} guid - RSS stream trace GUID string value
   * @property {string} link - Target web context URL address link
   * @property {string} title - Target display headline title string
   * @property {string} summary - Summary context block
   * @property {string} content_html - HTML structured markup context block
   * @property {string} author - Author identifier string trace
   * @property {string} published_at - Initial publication database trace timestamp
   * @property {string} updated_at - Last modification tracking timestamp data string
   * @property {number} feed_source_id - Parent stream configuration record tracking reference ID
   */

  /**
   * Feed article info wrapper returned on creation success
   * @typedef {object} FeedArticleCreatedResponse
   * @property {string} message - Success confirmation notice text
   * @property {FeedArticleDetails} attributes - The registered data content object values
   */

  /**
   * Feed article elements returned on update success
   * @typedef {object} FeedArticleUpdatedResponse
   * @property {string} message - Success confirmation string
   * @property {string} id - Target resource record index ID
   * @property {string} new_link - Finalized target destination reference web link URL
   * @property {string} new_title - Finalized title data string
   * @property {number} new_feed_source_id - Finalized parent source mapping standard identifier index
   */

  /**
   * GET /api/feed_articles
   * @summary Get all personal feed articles list
   * @tags Feed Articles
   * @security BearerAuth
   * @return {array<FeedArticleDetails>} 200 - List of feed articles matches successfully - application/json
   * @return 500 - Internal Server Error
   */

  // FIND ALL FEED ARTICLES

  getAll: async (req, res) => {
    try {
      // PASSING THE SECURE SESSION VALUE TO RETRIEVE PERSONALIZED FEED ITEMS

      const feedArticles = await feedArticleService.getAll(req.account.id);
      res.status(200).json(feedArticles);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching feed articles 🐾' + err });
    }
  },

  /**
   * GET /api/feed_articles/{id}
   * @summary Get an individual personal feed article by record ID
   * @tags Feed Articles
   * @security BearerAuth
   * @param {number} id.path.required - Feed Article ID
   * @return {FeedArticleDetails} 200 - Article detailed content entry metadata - application/json
   * @return 404 - Not Found (target record row does not exist or does not belong to user)
   * @return 500 - Internal Server Error
   */

  // GET A FEED ARTICLE BY ITS ID

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const feedArticle = await feedArticleService.getById(id);

      if (!feedArticle) {
        res.status(404).json({ status: 404, message: `No feed article with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(feedArticle);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching feed article 🐾' + err });
    }
  },

  /**
   * POST /api/feed_articles
   * @summary Create an individual article record under the account scope
   * @tags Feed Articles
   * @security BearerAuth
   * @param {FeedArticleCreateForm} request.body.required - Article structure generation data - application/json
   * @return {FeedArticleCreatedResponse} 200 - New article entry verified and generated - application/json
   * @return 400 - Bad Request (missing required payload criteria tags)
   * @return 404 - Not Found (database pipeline mapping entry step failure)
   * @return 500 - Internal Server Error
   */

  // CREATE A FEED ARTICLE

  create: async (req, res) => {
    try {
      const { guid, link, title, summary, content_html, author, published_at, updated_at, feed_source_id } = req.body;

      if (!feed_source_id || !guid || !link || !title) {
        return res.status(400).json({ status: 400, message: 'feed source id, guid, link & title are required' });
      }

      const feedArticle = await feedArticleService.create({
        guid,
        link,
        title,
        summary,
        content_html,
        author,
        published_at,
        updated_at,
        feed_source_id
      });

      if (!feedArticle) {
        return res.status(404).json({ status: 404, message: `Could not create feed article, sorry` });
      }

      feedArticle.message = 'feed article created';
      res.status(200).json({ message: 'feed article created', 'attributes': feedArticle });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while creating feed article 🐾: ' + err });
    }
  },

  /**
   * PATCH /api/feed_articles/{id}
   * @summary Update an active feed article standard content setup (Administrative scope)
   * @tags Feed Articles
   * @security BearerAuth
   * @param {number} id.path.required - Target Feed Article ID
   * @param {FeedArticleUpdateForm} request.body.required - Target elements to update modifications values - application/json
   * @return {FeedArticleUpdatedResponse} 200 - Field tracking changes modified successfully - application/json
   * @return 400 - Bad Request (no field values targeting a change were provided)
   * @return 404 - Not Found (target record entity missing)
   * @return 500 - Internal Server Error (database record write modification error)
   */

  // UPDATE A FEED ARTICLE (ADMIN ONLY)

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const feedArticle = await feedArticleService.getById(id);

      if (!feedArticle) {
        return res.status(404).json({ status: 404, message: `No feed article with ID ${id}, sorry admin` });
      }

      const { link, title, feed_source_id } = req.body;

      if (!link && !feed_source_id) {
        return res.status(400).json({ status: 400, message: 'Provide at least one value to update' });
      }

      const new_link = link ?? feedArticle.link;
      const new_title = title ?? feedArticle.title;
      const new_feed_source_id = feed_source_id ?? feedArticle.feed_source_id;

      const updated = await feedArticleService.update(id, { link, title, feed_source_id });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `Failed to update feed article with ID ${id}` });
      }

      res.status(200).json({ message: 'Feed article updated', id, new_link, new_title, new_feed_source_id });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the feed article 🐾' + err });
    }
  }
}

module.exports = feedArticleController;