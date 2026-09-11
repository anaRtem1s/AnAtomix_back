// IMPORT OF A SEQUELIZE OBJECT

const { Sequelize } = require("sequelize");
const accountBuilder = require("./account/accountModel.js");

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


//! TODO : DEFINING RELATIONSHIPS BETWEEN MODELS

//  * 1 TO MANY *

// // ? One to Many entre Event et Category
// db.Category.hasMany(db.Event, { foreignKey : { allowNull : false }})
// db.Event.belongsTo(db.Category);

// // ? One To Many entre Event et account
// db.account.hasMany(db.Event, { foreignKey : { allowNull : false, field : 'creator_id' } })
// db.Event.belongsTo(db.account);

// * MANY TO MANY *
// Dans le cas où il n'y a pas d'attribut dans la relation
// db.Event.belongsToMany(db.account, { through : 'participation' })
// db.account.belongsToMany(db.Event, { through : 'participation' })

// Dans le cas où il y a des attributs dans la relation
// On doit définir un model pour la table intermédiaire et l'utiliser dans la relation
// // ? Many To Many entre Event et account (Participations)
// db.Event.belongsToMany(db.account, { through : db.Participation })
// db.account.belongsToMany(db.Event, { through : db.Participation })

// // ? Many to Many entre account et account (Amitié)
// db.account.belongsToMany(db.account, 
//   { 
//     through : db.FrienShip, 
//     foreignKey : { field : 'senderId'},
//     otherKey : 'receiverId',                 
//     as : 'sender' })

//     db.account.belongsToMany(db.account, 
//       { 
//         through : db.FrienShip, 
//         foreignKey : { field : 'receiverId'},
//         otherKey : 'senderId', 
//         as : 'receiver'}) 

module.exports = db;