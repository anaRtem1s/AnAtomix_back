const categoryService = require("../services/categoryService.js");

const categoryController = {

  // GET ALL CATEGORIES OF ACCOUNT (belongs to the account in URL)
  //! GET	/api/accounts/:id/categories	
  async getAll(req, res) {
    try {
      const targetAccountId = parseInt(req.params.id);
      const myAccountId = req.account.id;
      const isAdmin = req.account.role === 'admin';

      // Member: MUST use their own account ID
      if (!isAdmin && targetAccountId !== myAccountId) {
        return res.status(403).json({ status: 403, message: "You can only access your own categories" });
      }

      const categories = await categoryService.findAllByAccount(targetAccountId, isAdmin);
      return res.json({ status: 200, data: categories });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 500, message: "Server error while fetching categories" });
    }
  }

  // GET ONE CATEGORY OF ACCOUNT (belongs to the account in URL)
  //! GET	/api/accounts/:id/categories/:categoryId	
  async getById(req, res) {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const targetAccountId = parseInt(req.params.id);
      const myAccountId = req.account.id;
      const isAdmin = req.account.role === 'admin';

      // Member: MUST use their own account ID in URL
      if (!isAdmin && targetAccountId !== myAccountId) {
        return res.status(403).json({ status: 403, message: "You can only access your own categories" });
      }

      const category = await categoryService.findById(categoryId, targetAccountId, isAdmin);

      if (!category) {
        return res.status(404).json({ status: 404, message: "Category not found or you don't have permission" });
      }

      return res.json({ status: 200, data: category });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 500, message: "Server error while fetching category" });
    }
  }

  // CREATE ONE CATEGORY OF ACCOUNT (belongs to the account in URL)
  //! POST	/api/accounts/:id/categories	
  async create(req, res) {
    try {
      const { name } = req.body;
      const accountId = parseInt(req.params.id);
      const myAccountId = req.account.id;

      // Member: MUST create in their own account
      if (accountId !== myAccountId) {
        return res.status(403).json({ status: 403, message: "You can only create categories in your own account" });
      }

      const category = await categoryService.create(name, accountId);
      return res.status(201).json({ status: 201, message: "Category created", data: category });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ status: 409, message: "Category name already exists for this account" });
      }
      return res.status(500).json({ status: 500, message: "Server error while creating category" });
    }
  }

  // UPDATE ONE CATEGORY OF ACCOUNT (belongs to the account in URL)
  //! PATCH	/api/accounts/:id/categories/:categoryId
  async update(req, res) {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const targetAccountId = parseInt(req.params.id);
      const myAccountId = req.account.id;
      const { name } = req.body;

      // Cannot modify "Unspecified" (id 1)
      if (categoryId === 1) {
        return res.status(403).json({ status: 403, message: "Cannot modify the Unspecified category" });
      }

      // Member: MUST use their own account ID in URL
      if (targetAccountId !== myAccountId) {
        return res.status(403).json({ status: 403, message: "You can only modify your own categories" });
      }

      const updated = await categoryService.update(categoryId, name, targetAccountId, false);

      if (!updated) {
        return res.status(404).json({ status: 404, message: "Category not found or you don't have permission" });
      }

      return res.json({ status: 200, message: "Category updated", data: updated });
    } catch (err) {
      console.error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ status: 409, message: "Category name already exists for this account" });
      }
      return res.status(500).json({ status: 500, message: "Server error while updating category" });
    }
  }

  // DELETE ONE CATEGORY OF ACCOUNT (belongs to the account in URL)
  //! DELETE / api / accounts /: id / categories /:categoryId	
  async delete(req, res) {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const targetAccountId = parseInt(req.params.id);
      const myAccountId = req.account.id;

      // Cannot delete "Unspecified" (id 1)
      if (categoryId === 1) {
        return res.status(403).json({ status: 403, message: "Cannot delete the Unspecified category" });
      }

      // Member: MUST use their own account ID in URL
      if (targetAccountId !== myAccountId) {
        return res.status(403).json({ status: 403, message: "You can only delete your own categories" });
      }

      const deleted = await categoryService.delete(categoryId, targetAccountId, false);

      if (!deleted) {
        return res.status(404).json({ status: 404, message: "Category not found or you don't have permission" });
      }

      return res.json({ status: 200, message: "Category deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 500, message: "Server error while deleting category" });
    }
  }
}

module.exports = categoryController;