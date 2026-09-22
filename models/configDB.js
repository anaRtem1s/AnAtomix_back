// IMPORT OF A SEQUELIZE OBJECT

const { Sequelize } = require("sequelize");
const accountBuilder = require("./accountModel.js");
const feedSourceBuilder = require("./feedSourceModel.js");
const categoryBuilder = require("./categoryModel.js");
const tagBuilder = require("./tagModel.js");
const subscriptionBuilder = require("./subscriptionModel.js");
const feedArticleBuilder = require("./feedArticleModel.js");
const accountArticleBuilder = require("./mm_accountArticleModel.js");
const articleTagBuilder = require("./mm_articleTagModel.js");

// RECUPERATION OF THE USEFUL ENV VARIABLES

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_DIALECT } = process.env;

// INITIALIZATION OF A SEQUELIZE INSTANCE

const sequelize = new Sequelize(
  // connection options
  {
    host: DB_HOST,         // DB server host
    port: DB_PORT,         // DB server port
    database: DB_DATABASE, // DB name
    username: DB_USERNAME, // DB username
    password: DB_PASSWORD, // DB password
    dialect: DB_DIALECT    // DB SQL language
  }
)
const db = {};
db.sequelize = sequelize;

// DEFINING THE MODELS USED BY DB
db.account = accountBuilder(sequelize);
db.feedSource = feedSourceBuilder(sequelize);
db.category = categoryBuilder(sequelize);
db.tag = tagBuilder(sequelize);
db.subscription = subscriptionBuilder(sequelize);
db.feedArticle = feedArticleBuilder(sequelize);
db.accountArticle = accountArticleBuilder(sequelize);
db.articleTag = articleTagBuilder(sequelize);

// DEFINING RELATIONSHIPS BETWEEN MODELS

//  * 1 TO MANY *

// ---- ACCOUNT 1-n CATEGORY ----
db.account.hasMany(db.category, { foreignKey: { name: "account_id", allowNull: false }, onDelete: "CASCADE" }); // NOT NULL to match live DB
db.category.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: false } }); // NOT NULL 

// ---- ACCOUNT 1-n TAG ----
db.account.hasMany(db.tag, { foreignKey: { name: "account_id", allowNull: false }, onDelete: "CASCADE" });
db.tag.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: false } });

// ---- ACCOUNT 1-n SUBSCRIPTION ----
db.account.hasMany(db.subscription, { foreignKey: { name: "account_id", allowNull: false }, onDelete: "CASCADE" });
db.subscription.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: false } });

// ---- FEED_SOURCE 1-n SUBSCRIPTION ----
db.feedSource.hasMany(db.subscription, { foreignKey: { name: "feed_source_id", allowNull: false }, onDelete: "CASCADE" });
db.subscription.belongsTo(db.feedSource, { foreignKey: { name: "feed_source_id", allowNull: false } });

// ---- CATEGORY 1-n SUBSCRIPTION ----
// Delete a category -> subscriptions null the FK (means unspecified).
db.category.hasMany(db.subscription, { foreignKey: { name: "category_id", allowNull: true }, onDelete: "SET NULL" });
db.subscription.belongsTo(db.category, { foreignKey: { name: "category_id", allowNull: true } });

// ---- FEED_SOURCE 1-n FEED_ARTICLE ----
db.feedSource.hasMany(db.feedArticle, { foreignKey: { name: "feed_source_id", allowNull: false }, onDelete: "CASCADE" });
db.feedArticle.belongsTo(db.feedSource, { foreignKey: { name: "feed_source_id", allowNull: false } });

// * MANY TO MANY *

// ---- ACCOUNT n-n FEED_ARTICLE ----
// The "read/favorite" state of an article, per account.
db.account.belongsToMany(db.feedArticle, { through: db.accountArticle, foreignKey: "account_id", otherKey: "article_id", onDelete: "CASCADE" });
db.feedArticle.belongsToMany(db.account, { through: db.accountArticle, foreignKey: "article_id", otherKey: "account_id", onDelete: "CASCADE" });
db.account.hasMany(db.accountArticle, { foreignKey: "account_id" });
db.accountArticle.belongsTo(db.account, { foreignKey: "account_id" });
db.feedArticle.hasMany(db.accountArticle, { foreignKey: "article_id" });
db.accountArticle.belongsTo(db.feedArticle, { foreignKey: "article_id" });

// ---- FEED_ARTICLE / TAG / ACCOUNT junction (mm_article_tag) ----

db.articleTag.belongsTo(db.account, { foreignKey: "account_id" });
db.articleTag.belongsTo(db.feedArticle, { foreignKey: "article_id" });
db.articleTag.belongsTo(db.tag, { foreignKey: "tag_id" });
db.account.hasMany(db.articleTag, { foreignKey: "account_id" });
db.feedArticle.hasMany(db.articleTag, { foreignKey: "article_id" });
db.tag.hasMany(db.articleTag, { foreignKey: "tag_id" });

module.exports = db;