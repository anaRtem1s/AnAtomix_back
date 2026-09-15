// IMPORT OF A SEQUELIZE OBJECT

const { Sequelize } = require("sequelize");
const accountBuilder = require("./account/accountModel.js");
const tagBuilder          = require("./tag/tagModel.js");
const feedSourceBuilder   = require("./feed_source/feedSourceModel.js");
const subscriptionBuilder = require("./subscription/subscriptionModel.js");
const feedArticleBuilder  = require("./feed_article/feedArticleModel.js");
const readStatusBuilder   = require("./readStatus/readStatusModel.js");   //  mm_account_article_read_status
const articleTagBuilder   = require("./article__tag/articleTagModel.js");   //  mm_article_tag

// RECUPERATION OF THE USEFUL ENV VARIABLES

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_DIALECT} = process.env;

// INITIALIZATION OF A SEQUELIZE INSTANCE

const sequelize = new Sequelize(
  // connection options
  {
    host : DB_HOST, /* server */
    port : DB_PORT, /* port of the DB server */
    database : DB_DATABASE, /* DB name*/
    username : DB_USERNAME, /* username to connect to DB*/
    password : DB_PASSWORD, /* psswd to connect to db */
    dialect : DB_DIALECT /* SQL lg */
  }
)

const db = {};
db.sequelize = sequelize;

// DEFINING THE MODELS USED BY DB

db.account = accountBuilder(sequelize);
db.category     = categoryBuilder(sequelize);
db.tag          = tagBuilder(sequelize);
db.feedSource   = feedSourceBuilder(sequelize);
db.subscription = subscriptionBuilder(sequelize);
db.feedArticle  = feedArticleBuilder(sequelize);
db.readStatus   = readStatusBuilder(sequelize);   // mm_account_article_read_status
db.articleTag   = articleTagBuilder(sequelize);   // mm_article_tag


// DEFINING RELATIONSHIPS BETWEEN MODELS

//  * 1 TO MANY *

// ---- ACCOUNT 1-n CATEGORY ----
// account_id is NULLABLE on purpose: the global "Unspecified" (id 1) has no owner.
db.account.hasMany(db.category,   { foreignKey: { name: "account_id", allowNull: true }, onDelete: "CASCADE" });
db.category.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: true } });

// ---- ACCOUNT 1-n TAG ----
db.account.hasMany(db.tag,   { foreignKey: { name: "account_id", allowNull: false }, onDelete: "CASCADE" });
db.tag.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: false } });

// ---- ACCOUNT 1-n SUBSCRIPTION ----
db.account.hasMany(db.subscription,   { foreignKey: { name: "account_id", allowNull: false }, onDelete: "CASCADE" });
db.subscription.belongsTo(db.account, { foreignKey: { name: "account_id", allowNull: false } });

// ---- FEED_SOURCE 1-n SUBSCRIPTION ----
db.feedSource.hasMany(db.subscription,   { foreignKey: { name: "feed_source_id", allowNull: false }, onDelete: "CASCADE" });
db.subscription.belongsTo(db.feedSource, { foreignKey: { name: "feed_source_id", allowNull: false } });

// ---- CATEGORY 1-n SUBSCRIPTION ----
// Delete a folder -> its feeds fall back to category id 1 ("Unspecified").
db.category.hasMany(db.subscription,   { foreignKey: { name: "category_id", allowNull: false }, onDelete: "SET DEFAULT" });
db.subscription.belongsTo(db.category, { foreignKey: { name: "category_id", allowNull: false } });

// ---- FEED_SOURCE 1-n FEED_ARTICLE ----
db.feedSource.hasMany(db.feedArticle,   { foreignKey: { name: "feed_source_id", allowNull: false }, onDelete: "CASCADE" });
db.feedArticle.belongsTo(db.feedSource, { foreignKey: { name: "feed_source_id", allowNull: false } });




// * MANY TO MANY *

// ---- ACCOUNT n-n FEED_ARTICLE  (through mm_account_article_read_status) ----
// The "read/favorite" state of an article, per user.
db.account.belongsToMany(db.feedArticle, { through: db.readStatus, foreignKey: "account_id", otherKey: "article_id", onDelete: "CASCADE" });
db.feedArticle.belongsToMany(db.account, { through: db.readStatus, foreignKey: "article_id", otherKey: "account_id", onDelete: "CASCADE" });

// Direct access to the junction rows (so you can read/write is_read, read_at, is_loved via include):
db.account.hasMany(db.readStatus,       { foreignKey: "account_id" });
db.feedArticle.hasMany(db.readStatus,   { foreignKey: "article_id" });
db.readStatus.belongsTo(db.account,     { foreignKey: "account_id" });
db.readStatus.belongsTo(db.feedArticle, { foreignKey: "article_id" });

// ---- FEED_ARTICLE n-n TAG  (through mm_article_tag) ----
db.feedArticle.belongsToMany(db.tag, { through: db.articleTag, foreignKey: "article_id", otherKey: "tag_id", onDelete: "CASCADE" });
db.tag.belongsToMany(db.feedArticle, { through: db.articleTag, foreignKey: "tag_id", otherKey: "article_id", onDelete: "CASCADE" });
db.feedArticle.hasMany(db.articleTag,   { foreignKey: "article_id" });
db.tag.hasMany(db.articleTag,           { foreignKey: "tag_id" });
db.articleTag.belongsTo(db.feedArticle, { foreignKey: "article_id" });
db.articleTag.belongsTo(db.tag,         { foreignKey: "tag_id" });



module.exports = db;