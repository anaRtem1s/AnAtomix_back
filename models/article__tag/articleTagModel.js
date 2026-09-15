const { Sequelize, DataTypes } = require("sequelize");

/**
 * ArticleTag Builder  -> table mm_article_tag
 * Junction between feed_article and tag.
 * Keys (article_id, tag_id) come from belongsToMany(...) in the ASSOCIATIONS step.
 * @param { Sequelize } sequelize
 */
const articleTagBuilder = (sequelize) => {
  const ArticleTag = sequelize.define(
    'mm_article_tag',
    {
      assigned_at: { type: 'TIMESTAMPTZ', allowNull: false, defaultValue: sequelize.literal('NOW()') }
    },
    {
      tableName: 'mm_article_tag',
      timestamps: false
    }
  );
  return ArticleTag;
};

module.exports = articleTagBuilder;
