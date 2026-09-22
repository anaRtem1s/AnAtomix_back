// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES) 

const tagService = require("../services/tagService.js");

const tagController = {

  /**
     * Tag creation / update form model
     * @typedef {object} TagForm
     * @property {string} title.required - Title of the tag
     * @property {string} color - Optional color code/name for the tag
     */

  /**
   * Base tag details structure
   * @typedef {object} TagDetails
   * @property {number} id - Unique identifier
   * @property {number} account_id - Owner account ID
   * @property {string} title - Title of the tag
   * @property {string} color - Color code/name of the tag
   */

  /**
   * Tag info wrapper returned on creation success
   * @typedef {object} TagCreatedResponse
   * @property {string} message - Success message
   * @property {TagDetails} attributes - The created tag data
   */

  /**
   * Tag info returned on update success
   * @typedef {object} TagUpdatedResponse
   * @property {string} message - Success message
   * @property {string} id - Updated tag ID
   * @property {string} new_title - The finalized title
   * @property {string} new_color - The finalized color
   */

  /**
   * Standard message envelope for deletion or simple responses
   * @typedef {object} TagMessageResponse
   * @property {number} status - HTTP status code matching the header
   * @property {string} message - Operational details
   */

  /**
   * GET /api/tags
   * @summary Get all tags for the authenticated account
   * @tags Tags
   * @security BearerAuth
   * @return {array<TagDetails>} 200 - List of tags - application/json
   * @return 500 - Internal Server Error
   */

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

  /**
   * GET /api/tags/{id}
   * @summary Get a tag by its ID
   * @tags Tags
   * @security BearerAuth
   * @param {number} id.path.required - Tag ID
   * @return {TagDetails} 200 - Tag details - application/json
   * @return 404 - Not Found (tag doesn't exist or belongs to another account)
   * @return 500 - Internal Server Error
   */

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

  /**
    * POST /api/tags
    * @summary Create a new tag
    * @tags Tags
    * @security BearerAuth
    * @param {TagForm} request.body.required - Tag data - application/json
    * @return {TagCreatedResponse} 200 - Tag created successfully - application/json
    * @return 400 - Bad Request (missing title)
    * @return 404 - Not Found (creation process failed)
    * @return 500 - Internal Server Error
    */

  // CREATE A TAG

  //? POST	/api/tags/

  create: async (req, res) => {
    try {

      const { title, color } = req.body;

      //? CHECKING MANDATORY FIELDS 

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

  /**
   * DELETE /api/tags/{id}
   * @summary Delete a tag by its ID
   * @tags Tags
   * @security BearerAuth
   * @param {number} id.path.required - Tag ID
   * @return {TagMessageResponse} 200 - Tag deleted successfully - application/json
   * @return 404 - Not Found (tag doesn't exist, belongs to another account, or deletion failed)
   * @return 500 - Internal Server Error
   */

  // DELETE A TAG

  //? DELETE /api/tags/:id

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

  /**
 * PATCH /api/tags/{id}
 * @summary Update an existing tag's details
 * @tags Tags
 * @security BearerAuth
 * @param {number} id.path.required - Tag ID
 * @param {TagForm} request.body.required - Target elements to update - application/json
 * @return {TagUpdatedResponse} 200 - Tag updated details - application/json
 * @return 400 - Bad Request (missing updated title input)
 * @return 404 - Not Found (tag doesn't exist or belongs to another account)
 * @return 500 - Internal Server Error (failed to update row values)
 */

  // UPDATE A TAG - NOT IMPLEMENTED IN ROUTES

  //? PATCH	/api/tags/:id

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