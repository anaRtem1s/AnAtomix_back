const db = require("../models/configDB.js");

const categoryService = {

  // FIND ALL CATEGORIES

  getAll: async (account_id) => {
    try {
      const categories = await db.category.findAll({ 
        attributes: ['id', 'title'], // Columns you want to return
        where: { account_id: account_id } // Filter condition
      });
      return categories;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND ONE CATEGORY BY ID

  getById: async (id) => {
    try {
      const categoryFound = await db.category.findByPk(id,
        { attributes: ['id', 'title', 'account_id'] });
      return categoryFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // CREATE A CATEGORY

  create: async (categoryToCreate) => {
    try {

      const categoryCreated = await db.category.create(categoryToCreate);

      return categoryCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },


  // DELETE A CATEGORY

  delete: async (id) => {
    try {
      const deletedRow = await db.category.destroy({ where: { id } });

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

  // UPDATE A CATEGORY (TITLE)

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.category.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },
}

module.exports = categoryService;