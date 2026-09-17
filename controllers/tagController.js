// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES) 

const tagService = require("../services/tagService.js");

const tagController = {

  // GET ALL TAGS

  //? GET	/api/tags

  getAll: async (req, res) => {
    try {
      const tags = await tagService.getAll(req.account.id);
      res.status(200).json(tags);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching tags 🐾' + err });
    }
  },

  // GET A TAG BY ITS ID

  //? GET	/api/tags/:id

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const tag = await tagService.getById(id);

      if (!tag || tag.account_id !== req.account.id) {
        res.status(404).json({ status: 404, message: `No tag with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(tag);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching tag 🐾' + err });
    }
  },


  // CREATE A TAG

  //? POST	/api/tags/

  create: async (req, res) => {
    try {

      const { title, color } = req.body;

      //? CHECKING MANDATORY FIELDS - CHECK FOR MANDATORY account_id?

      if (!title) {
        return res.status(400).json({ status: 400, message: 'Tag title is required' });
      }

      const tag = await tagService.create(
        {
          account_id: req.account.id,
          title,
          color
        });

      if (!tag) {
        return res.status(404).json({ status: 404, message: `Could not create tag, sorry` });
      }

      tag.message = 'Tag created';
      res.status(200).json({ message: 'Tag created', 'attributes': tag });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while creating tag 🐾: ' + err });
    }
  },

  // DELETE A TAG

  //? DELETE /api/tag/:id

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      // CHECKING IF TAG TO DELETE EXISTS IN DB

      const tag = await tagService.getById(id);

      if (!tag || tag.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No tag with ID ${id}, sorry` })
      }
      else {

        const deleted = await tagService.delete(id);

        if (deleted) {

          // 204 DOES NOT ACCEPT BODY, SO 200 HERE

          res.status(200).json({
            status: 200,
            message: 'Tag deleted successfully'
          });
        }
        else {
          res.status(404).json({
            status: 404,
            message: `Could not delete tag with ID ${id}`
          });
        }
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while deleting the tag 🐾' + err });
    }
  },


  // UPDATE A TAG

  //? PATCH	/api/tag/:id

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const tag = await tagService.getById(id);

      if (!tag || tag.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No tag with ID ${id}, sorry` });
      }

      const { title, color } = req.body;

      if (!title) {
        return res.status(400).json({ status: 400, message: 'Provide a title or a color to update, please' });
      }

      const new_title = title ?? tag.title;
      const new_color = color ?? tag.color;

      const updated = await tagService.update(id, { title, color });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `Failed to update tag title / color with ID ${id}` });
      }

      res.status(200).json({ message: 'Tag updated', id, new_title, new_color });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the tag 🐾' + err });
    }
  }
}

module.exports = tagController;