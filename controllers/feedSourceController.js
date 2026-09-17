const feedSourceService = require("../services/feedSourceService.js");

//!CHECK 

const feedSourceController = {

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

  //  GET A FEED SOURCE BY ITS ID

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const feedSource = await feedSourceService.getById(id);

      if (!feedSource) {
        res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(feedSource);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching feed source 🐾' + err });
    }
  },

  // CREATE A FEED SOURCE 

  create: async (req, res) => {
    try {

      const { feed_url, feed_type, title, descr, site_url } = req.body;

      //? CHECKING MANDATORY FIELDS - CHECK FOR MANDATORY FEED TYPE (USER KNOWS?)

      if (!feed_url || !feed_type || !title) {
        return res.status(400).json({ status: 400, message: 'Feed URL, Feed type (Atom / RSS), & Feed source title are required' });
      }

      const feedSourceCreated = await feedSourceService.create(
        {
          feed_url,
          feed_type,
          title,
          descr,
          site_url
        });

      if (!feedSourceCreated) {
        return res.status(404).json({ status: 404, message: `Could not create feed source, sorry` });
      }

      feedSourceCreated.message = 'Feed source created';
      res.status(200).json({ message: 'Feed source created', 'attributes': feedSourceCreated });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while creating feed source 🐾: ' + err });
    }
  },

  // DELETE FEED SOURCE

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      // CHECKING IF FEED SOURCE TO DELETE EXISTS IN DB

      const feedSourceToDelete = await feedSourceService.getById(id);

      if (!feedSourceToDelete) {
        return res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` })
      }
      else {

        const deleted = await feedSourceService.delete(id);

        if (deleted) {

          // 204 DOES NOT ACCEPT BODY, SO 200 HERE

          res.status(200).json({
            status: 200,
            message: 'Feed source deleted successfully'
          });
        }
        else {
          res.status(404).json({
            status: 404,
            message: `Could not delete feed source with ID ${id}`
          });
        }
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while deleting the feed source 🐾' + err });
    }
  },

  // UPDATE A FEED SOURCE

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const feedSource = await feedSourceService.getById(id);

      if (!feedSource) {
        return res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` });
      }

      const { feed_url, feed_type, title, descr, site_url } = req.body;

      if (!feed_url && !feed_type && !title && !descr && !site_url) {
        return res.status(400).json({ status: 400, message: 'Provide at least one value to update' });
      }

      const new_feed_url = feed_url ?? feedSource.feed_url;
      const new_feed_type = feed_type ?? feedSource.feed_type;
      const new_title = title ?? feedSource.title;
      const new_descr = descr ?? feedSource.descr;
      const new_site_url = site_url ?? feedSource.site_url;

      const updated = await feedSourceService.update(id, { feed_url, feed_type, title, descr, site_url });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `Failed to update feed source with ID ${id}` });
      }

      res.status(200).json({ message: 'Feed source updated', id, new_feed_url, new_feed_type, new_title, new_descr, new_site_url });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the feed source 🐾' + err });
    }
  }
}

module.exports = feedSourceController;