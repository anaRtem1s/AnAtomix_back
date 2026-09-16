const categoryService = require("../services/feedSourceService.js");

const feedSourceController = {

    // GET ALL FEED SOURCES
    getAll: async (req, res) => {
        try {
            const feedSources = await feedSourceService.getAll();
            res.status(200).json(feedSources);
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occured' });
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
            res.status(500).json({ status: 500, message: 'An error occured' });
        }
    },
    // CREATE FEED SOURCE
    create: async (req, res) => {
        try {
          
            const { feed_url, feed_type, title, description, site_url } = req.body;

            if (!feed_url || !feed_type || !title) {
                return res.status(400).json({ status: 400, message: 'Feed URL, Feed type, and Title are required' });
            }
            
            const created = await feedSourceService.create(id, { feed_url, feed_type, title, description, site_url });

            if (!created) {
                return res.status(404).json({ status: 404, message: `Could not create feed source, sorry` });
            }

            res.status(200).json({ message: 'Feed source created' });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occurred' });
        }
    },
    // DELETE FEED SOURCE
    delete: async (req, res) => {
        try {
            const id = req.params.id;

            // CHECKING IF ACCOUNT TO DELETE EXISTS IN DB

            const feedSourceToDelete = await feedSourceService.getById(id);

            if (!feedSourceToDelete) {
                res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` })
            }
            else {
                const deleted = await feedSourceService.delete(id);
                if (deleted) {
                    res.sendStatus(204);
                }
                else {
                    throw new Error();
                }
            }
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occured' });
        }
    },
    // UPDATE FEED SOURCE
    update: async (req, res) => {
        try {
            const id = req.params.id;

            const feedSource = await feedSourceService.getById(id);

            if (!feedSource) {
                return res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` });
            }

            const { feed_url, feed_type, title, description, site_url } = req.body;

            const new_feed_url = feed_url ?? feedSource.feed_url;
            const new_feed_type = feed_type ?? feedSource.feed_type;
            const new_title = title ?? feedSource.title;
            const new_description = description ?? feedSource.description;
            const new_site_url = site_url ?? feedSource.site_url;
            
            const updated = await feedSourceService.update(id, { new_feed_url, new_feed_type, new_title, new_description, new_site_url });

            if (!updated) {
              // TODO make the user know what went wrong during update
                return res.status(404).json({ status: 404, message: `No feed source with ID ${id}, sorry` });
            }

            res.status(200).json({ message: 'Account updated' });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'An error occurred' });
        }
    }
}

module.exports = feedSourceController;