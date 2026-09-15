const { Sequelize, DataTypes } = require("sequelize");

/**
 * Tag Builder
 * @param { Sequelize } sequelize
 */
const tagBuilder = (sequelize) => {
  const Tag = sequelize.define(
    'tag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      color: {
        type: DataTypes.STRING(7),    // e.g. "#3366ff"
        allowNull: true
      }
      // account_id -> associations step. UNIQUE(account_id, name) enforced by the DB.
    },
    {
      tableName: 'tag',
      timestamps: false
    }
  );
  return Tag;
};

module.exports = tagBuilder;
