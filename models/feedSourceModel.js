// COMMUNICATION BACKEND - DATABASE WITH SEQUELIZE ORM
const { Sequelize, DataTypes } = require("sequelize");

/**
 * FeedSource Builder
 * @param { Sequelize } sequelize
 */
const feedSourceBuilder = (sequelize) => {
  const feedSource = sequelize.define(
    'feed_source',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      feed_url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        unique: 'UK_feed_source_feed_url'
      },
      feed_type: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: { isIn: [['rss', 'atom']] }
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      descr: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      site_url: {
        type: DataTypes.STRING(2048),
        allowNull: true
      }
    },
    {
      tableName: 'feed_source',
      timestamps: false
    }
  );
  return feedSource;
};

module.exports = feedSourceBuilder;
