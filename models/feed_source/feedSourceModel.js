const { Sequelize, DataTypes } = require("sequelize");

/**
 * FeedSource Builder
 * @param { Sequelize } sequelize
 */
const feedSourceBuilder = (sequelize) => {
  const FeedSource = sequelize.define(
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
      site_url:    { type: DataTypes.STRING(2048), allowNull: true },
      title:       { type: DataTypes.STRING(500),  allowNull: false },
      description: { type: DataTypes.TEXT,          allowNull: true },
      feed_type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { isIn: [['rss', 'atom']] }       // mirrors your DB CHECK
      },
      active:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      last_fetched_at:   { type: 'TIMESTAMPTZ',     allowNull: true },
      fetch_error_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      last_error:        { type: DataTypes.TEXT,    allowNull: true }
      // search_vector is a Postgres GENERATED column — intentionally NOT defined here.
      // (Sequelize must never try to write to a GENERATED ALWAYS column.)
    },
    {
      tableName: 'feed_source',
      timestamps: false
    }
  );
  return FeedSource;
};

module.exports = feedSourceBuilder;
