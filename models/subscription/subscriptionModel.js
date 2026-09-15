const { Sequelize, DataTypes } = require("sequelize");

/**
 * Subscription Builder  (a user's link to a feed, inside a category/folder)
 * @param { Sequelize } sequelize
 */
const subscriptionBuilder = (sequelize) => {
  const Subscription = sequelize.define(
    'subscription',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      sort_order:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      subscribed_at: { type: 'TIMESTAMPTZ',     allowNull: false, defaultValue: sequelize.literal('NOW()') }
      // account_id, feed_source_id, category_id -> associations step.
      // UNIQUE(account_id, feed_source_id) enforced by the DB.
    },
    {
      tableName: 'subscription',
      timestamps: false
    }
  );
  return Subscription;
};

module.exports = subscriptionBuilder;
