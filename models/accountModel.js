// COMMUNICATION BACKEND - DATABASE WITH SEQUELIZE ORM
const { Sequelize, DataTypes } = require("sequelize");

/**
* account Builder
* @param { Sequelize } sequelize
*/
const accountBuilder = (sequelize) => {
  const account = sequelize.define(
    'account',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'UK_account_Username'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'UK_account_Email'
      },
      passwordhash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },    
      creationdate: { type: 'TIMESTAMPTZ', defaultValue: sequelize.literal('NOW()') 
      },
      role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'member',
        validate: { isIn: [['member', 'admin']] } // VARCHAR + CHECK CONSTRAINT (NOT ENUM)
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
    },
    {
      tableName: 'account',
      timestamps: false
    }
  );
  return account;
};

module.exports = accountBuilder;