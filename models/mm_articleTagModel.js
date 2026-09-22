const { Sequelize, DataTypes } = require("sequelize");

/**
 * articleTag Builder - Junction between feed_article and tag.
 * Serves to keep track of tagged articles.
 * @param { Sequelize } sequelize
 */
const articleTagBuilder = (sequelize) => {
  const articleTag = sequelize.define(
    'mm_article_tag',
    {
      account_id: { type: DataTypes.INTEGER, primaryKey: true },
      article_id: { type: DataTypes.INTEGER, primaryKey: true },
      tag_id: { type: DataTypes.INTEGER, primaryKey: true },
      assigned_at: {
        type: 'TIMESTAMPTZ',
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      }
    },
    {
      tableName: 'mm_article_tag',
      timestamps: false
    }
  );
  return articleTag;
};

module.exports = articleTagBuilder;
