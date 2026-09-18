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
      // PK (article_id, tag_id) is by belongsToMany(...) in the ASSOCIATIONS step (configDB.js).
      assigned_at: {
        type: 'TIMESTAMPTZ',
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      }
      // FK article_id, tag_id are added in the ASSOCIATIONS step (configDB.js).
    },
    {
      tableName: 'mm_article_tag',
      timestamps: false
    }
  );
  return articleTag;
};

module.exports = articleTagBuilder;
