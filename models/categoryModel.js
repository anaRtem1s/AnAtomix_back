// COMMUNICATION BACKEND - DATABASE WITH SEQUELIZE ORM
const { Sequelize, DataTypes } = require("sequelize");

/**
 * category Builder
 * @param { Sequelize } sequelize
 */
const categoryBuilder = (sequelize) => {
  const category = sequelize.define(
    'category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false
      }
      // FK account_id is added in the ASSOCIATIONS step (configDB.js).
      // UNIQUE(account_id, title) is enforced by the database.
    },
    {
      tableName: 'category',
      timestamps: false             
    }
  );
  return category;
};

module.exports = categoryBuilder;
