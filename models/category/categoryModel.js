const { Sequelize, DataTypes } = require("sequelize");

/**
 * Category Builder
 * @param { Sequelize } sequelize
 */
const categoryBuilder = (sequelize) => {
  const Category = sequelize.define(
    'category',
    {
      id: {
        type: DataTypes.INTEGER,      // FIX: was BIGINT — your table column is INT
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      name: {
        type: DataTypes.STRING(255),  // FIX: was 200 — your column is VARCHAR(255)
        allowNull: false
      }
      // account_id is added in the ASSOCIATIONS step (configDB.js), and made
      // nullable there so the global "Unspecified" (id 1) can stay ownerless.
      // The real rule UNIQUE(account_id, name) is enforced by the database.
    },
    {
      tableName: 'category',
      timestamps: false               // FIX: updatedAt:false still kept a createdAt column your table doesn't have
    }
  );
  return Category;
};

module.exports = categoryBuilder;
