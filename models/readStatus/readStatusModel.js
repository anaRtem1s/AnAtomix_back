const { Sequelize, DataTypes } = require("sequelize");

/**
 * ReadStatus Builder  -> table mm_account_article_read_status
 * Junction between account and feed_article (per-user read + favorite state).
 * The two key columns (account_id, article_id) are created in the ASSOCIATIONS
 * step through belongsToMany(...); here we only define the link's own attributes.
 * @param { Sequelize } sequelize
 */
const readStatusBuilder = (sequelize) => {
  const ReadStatus = sequelize.define(
    'mm_account_article_read_status',
    {
      is_read:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      read_at:     { type: 'TIMESTAMPTZ',     allowNull: true },
      is_favorite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }  // the heart
    },
    {
      tableName: 'mm_account_article_read_status',
      timestamps: false
    }
  );
  return ReadStatus;
};

module.exports = readStatusBuilder;
