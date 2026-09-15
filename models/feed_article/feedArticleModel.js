const { Sequelize, DataTypes } = require("sequelize");

/**
 * FeedArticle Builder
 * @param { Sequelize } sequelize
 */
const feedArticleBuilder = (sequelize) => {
  const FeedArticle = sequelize.define(
    'feed_article',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      guid:         { type: DataTypes.STRING(500),  allowNull: false },
      link:         { type: DataTypes.STRING(2048), allowNull: false },
      title:        { type: DataTypes.STRING(1000), allowNull: false },
      summary:      { type: DataTypes.TEXT,          allowNull: true },
      content_html: { type: DataTypes.TEXT,          allowNull: true },
      author:       { type: DataTypes.STRING(500),   allowNull: true },
      published_at: { type: 'TIMESTAMPTZ',           allowNull: true },
      updated_at:   { type: 'TIMESTAMPTZ',           allowNull: true }
      // NOTE: updated_at is the ARTICLE's own date from the feed, NOT a Sequelize-managed
      // timestamp — that's why timestamps:false below (so Sequelize won't fight over it).
      // feed_source_id -> associations step. UNIQUE(feed_source_id, guid) enforced by the DB.
      // search_vector -> GENERATED column, intentionally not defined here.
    },
    {
      tableName: 'feed_article',
      timestamps: false
    }
  );
  return FeedArticle;
};

module.exports = feedArticleBuilder;
