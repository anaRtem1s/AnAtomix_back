const db = require("../models/configDB.js");

const tagService = {

  // FIND ALL TAGS

  getAll: async (account_id) => {
    try {
      const tags = await db.tag.findAll({
        attributes: ['id', 'title', 'color'], // Columns to return
        where: { account_id: account_id } // Filter condition
      });
      return tags;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // FIND ONE TAG BY ID

  getById: async (id) => {
    try {
      const tagFound = await db.tag.findByPk(id,
        { attributes: ['id', 'title', 'color', 'account_id'] });
      return tagFound;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },

  // CREATE A TAG

  create: async (tagToCreate) => {
    try {

      const tagCreated = await db.tag.create(tagToCreate);

      return tagCreated;
    }
    catch (err) {

      throw new Error(err.message);
    }
  },


  // DELETE A TAG

  delete: async (id) => {
    try {
      const deletedRow = await db.tag.destroy({ where: { id } });

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

  // UPDATE A TAG (TITLE, COLOR)

  update: async (id, updates) => {
    try {
      const [updatedRow] = await db.tag.update(updates, { where: { id: id } });

      // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

      return updatedRow === 1;
    }
    catch (err) {
      throw new Error(err.message);
    }
  },
}

module.exports = tagService;