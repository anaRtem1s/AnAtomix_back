// COMMUNICATION BACKEND - DATABASE WITH SEQUELIZE ORM
const { Sequelize, DataTypes } = require("sequelize");

/**
 * subscription Builder  (a user's link to a feed, inside a category/folder)
 * @param { Sequelize } sequelize
 */
const subscriptionBuilder = (sequelize) => {
  const subscription = sequelize.define(
    'subscription',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      subscribed_at: {
        type: 'TIMESTAMPTZ',
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      }
      // FK account_id, feed_source_id, category_id are added in the ASSOCIATIONS step (configDB.js).
      // UNIQUE(account_id, feed_source_id) is enforced by the database.
    },
    {
      tableName: 'subscription',
      timestamps: false
    }
  );
  return subscription;
};

module.exports = subscriptionBuilder;
