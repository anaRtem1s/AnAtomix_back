// COMMUNICATION BACKEND JS - DATABASE WITH SEQUELIZE ORM

const { Sequelize, DataTypes } = require("sequelize");

/**
 * tag Builder
 * @param { Sequelize } sequelize
 */
const tagBuilder = (sequelize) => {
  const tag = sequelize.define(
    'tag',
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
      },
      color: {
        type: DataTypes.STRING(32), // e.g., "#3366ff", "rgba(10,12,50,255)"
        allowNull: true
      }
      // FK account_id is added in the ASSOCIATIONS step (configDB.js).
      // UNIQUE(account_id, title) is enforced by the database.
    },
    {
      tableName: 'tag',
      timestamps: false
    }
  );
  return tag;
};

module.exports = tagBuilder;
