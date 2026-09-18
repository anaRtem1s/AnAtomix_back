// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES) 

const categoryService = require("../services/categoryService.js");

const categoryController = {
  /**
 * Category creation form model
 * @typedef {object} CategoryForm
 * @property {string} title.required - Title of the category
 */

  /**
   * Category info returned on success
   * @typedef {object} CategoryInfo
   * @property {number} id - Unique identifier
   * @property {string} title - Title of the category
   * @property {number} account_id - Owner account ID
   */

  /**
   * GET /api/categories
   * @summary Get all categories for the authenticated account
   * @tags Categories
   * @security BearerAuth
   * @return {array<CategoryInfo>} 200 - List of categories - application/json
   * @return 500 - Internal Server Error
   */

  // GET ALL CATEGORIES 

  //? GET	/api/categories

  getAll: async (req, res) => {
    try {
      const categories = await categoryService.getAll(req.account.id);
      res.status(200).json(categories);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching categories 🐾' + err });
    }
  },
  /**
     * GET /api/categories/{id}
     * @summary Get a category by its ID
     * @tags Categories
     * @security BearerAuth
     * @param {number} id.path.required - Category ID
     * @return {CategoryInfo} 200 - Category details - application/json
     * @return 404 - Not Found (category doesn't exist or belongs to another account)
     * @return 500 - Internal Server Error
     */

  // GET A CATEGORY BY ITS ID

  //? GET	/api/categories/:id

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const category = await categoryService.getById(id);

      if (!category || category.account_id !== req.account.id) {
        res.status(404).json({ status: 404, message: `No category with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(category);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching category 🐾' + err });
    }
  },
  /**
    * POST /api/categories
    * @summary Create a new category
    * @tags Categories
    * @security BearerAuth
    * @param {CategoryForm} request.body.required - Category data - application/json
    * @return {CategoryInfo} 201 - Category created - application/json
    * @return 400 - Bad Request (missing title)
    * @return 500 - Internal Server Error
    */

  // CREATE A CATEGORY 

  //? POST	/api/categories/

  create: async (req, res) => {
    try {

      const { title } = req.body;

      //? CHECKING MANDATORY FIELDS - CHECK FOR MANDATORY account_id?

      if (!title) {
        return res.status(400).json({ status: 400, message: 'Category title is required' });
      }

      const category = await categoryService.create(
        {
          account_id: req.account.id,
          title
        });

      if (!category) {
        return res.status(404).json({ status: 404, message: `Could not create category, sorry` });
      }

      category.message = 'Category created';
      res.status(200).json({ message: 'Category created', 'attributes': category });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while creating category 🐾: ' + err });
    }
  },

  /**
 * DELETE /api/categories/{id}
 * @summary Delete a category by its ID
 * @tags Categories
 * @security BearerAuth
 * @param {number} id.path.required - Category ID
 * @return {CategoryMessageResponse} 200 - Category deleted successfully - application/json
 * @return 404 - Not Found (category doesn't exist or belongs to another account)
 * @return 500 - Internal Server Error
 */

  // DELETE A CATEGORY 

  //? DELETE /api/category/:id

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      // CHECKING IF CATEGORY TO DELETE EXISTS IN DB

      const category = await categoryService.getById(id);

      if (!category || category.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No category with ID ${id}, sorry` })
      }
      else {

        const deleted = await categoryService.delete(id);

        if (deleted) {

          // 204 DOES NOT ACCEPT BODY, SO 200 HERE

          res.status(200).json({
            status: 200,
            message: 'Category deleted successfully'
          });
        }
        else {
          res.status(404).json({
            status: 404,
            message: `Could not delete category with ID ${id}`
          });
        }
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while deleting the category 🐾' + err });
    }
  },

  /**
   * PATCH /api/categories/{id}
   * @summary Update an existing category
   * @tags Categories
   * @security BearerAuth
   * @param {number} id.path.required - Category ID
   * @param {CategoryForm} request.body.required - Category details to update - application/json
   * @return {CategoryInfo} 200 - Updated category info - application/json
   * @return 400 - Bad Request (missing title)
   * @return 404 - Not Found (category doesn't exist or belongs to another account)
   * @return 500 - Internal Server Error
   */


  // UPDATE A CATEGORY 

  //? PATCH	/api/category/:id

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const category = await categoryService.getById(id);

      if (!category || category.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No category with ID ${id}, sorry` });
      }

      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ status: 400, message: 'Provide a title to update, please' });
      }

      const new_title = title ?? category.title;

      const updated = await categoryService.update(id, { title });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `Failed to update category title with ID ${id}` });
      }

      res.status(200).json({ message: 'Category updated', id, new_title });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the category\'s title  🐾' + err });
    }
  }
}

module.exports = categoryController;