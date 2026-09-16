const { Sequelize, DataTypes } = require("sequelize");

/**
 * feedArticle Builder
 * @param { Sequelize } sequelize
 */
const feedArticleBuilder = (sequelize) => {
  const feedArticle = sequelize.define(
    'feed_article',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      guid: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      link: {
        type: DataTypes.STRING(2048),
        allowNull: false
      },
      title: {
         type: DataTypes.STRING(1000),
         allowNull: false
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      content_html: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      author: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      published_at: {
        type: 'TIMESTAMPTZ',
        allowNull: true
      },
      updated_at: {
        type: 'TIMESTAMPTZ',
        allowNull: true
      }
      // FK feed_source_id is added in the ASSOCIATIONS step (configDB.js).
      // UNIQUE(feed_source_id, guid) is enforced by the database.
      // NOTE: fields are article related coming from the feed.
    },
    {
      tableName: 'feed_article',
      timestamps: false
    }
  );
  return feedArticle;
};

module.exports = feedArticleBuilder;
