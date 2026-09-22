const { Sequelize, DataTypes } = require("sequelize");

/**
 * accountArticle Builder - Junction between account and feed_article.
 * Serves to keep track of read status.
 * @param { Sequelize } sequelize
 */
const accountArticleBuilder = (sequelize) => {
  const accountArticle = sequelize.define(
    'mm_account_article',
    {
      // PK (account_id, article_id) is by belongsToMany(...) in the ASSOCIATIONS step (configDB.js).
      read_at: {
        type: 'TIMESTAMPTZ',
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      },

      is_favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
      // FK account_id, article_id are added in the ASSOCIATIONS step (configDB.js).
    },
    {
      tableName: 'mm_account_article',
      timestamps: false
    }
  );
  return accountArticle;
};

module.exports = accountArticleBuilder;
