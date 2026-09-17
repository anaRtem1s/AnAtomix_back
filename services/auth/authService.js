
// A SERVICE IS AN OBJECT CONTAINING FUNCTIONS (ONE PER RESSOURCE). HERE WE INTERACT WITH THE DATA (NEVER IN CONTROLLERS!).  LOGIC MANAGEMENT BEFORE DATA INSERTION INTO THE DB (EX: PASSWORD HASH).


const db = require("../../models/configDB.js");

const authService = {
  
  // FIND ACCOUNT BY THEIR EMAIL ADDRESS
  
  getByEmail: async (email) => {
    try {
      return await db.account.findOne({ where: { email: email } });
    }
    catch(err){
      throw new Error(err.message);
    }
  },
  
  // FIND ACCOUNT BY THEIR USERNAME (LOGIN VIA USERNAME)
  
  getByUsername : async (username) => {
    try {
      return await db.account.findOne({ where: { username: username } });
    }
    catch(err){
      throw new Error(err.message);
    }
  },
  
  // CREATE A NEW ACCOUNT (REGISTER)
  
  insert : async (accountToAdd) => {
    try {
      let accountAdded = await db.account.create(accountToAdd);
      
      // IF ACCOUNTADDED, WE MODIFY IT WITH "findByPK" TO REMOVE PSSWD
      
      if(accountAdded){
        
        accountAdded = await db.account.findByPk(accountAdded.id, { attributes: { exclude: ['passwordhash'] } }); // passwordhash = array to match Sequelize's standards
      }
      return accountAdded;
    }
    catch(err){
      
      throw new Error(err.message);
    }
  },
  
  // EMAIL ALREADY TAKEN BY ANOTHER ACCOUNT (REGISTER)
  
  emailAlreadyUsed : async (email) => {
    try {
      const accountFound = await db.account.findOne( { where : { 'email' : email }});
      
      if(accountFound) {
        return true;
      }
      else {
        return false;
      }
    }
    catch(err) {
      
      throw new Error(err.message);
    }
  },
  
  // USERNAME ALREADY TAKEN (REGISTER)
  
  usernameAlreadyUsed: async (username) => {
    try {
      const accountFound = await db.account.findOne({ where: { username: username } });
      
      return !!accountFound; // Same logic as if/else
      }
    
    catch(err){
      
      throw new Error(err.message);
    }
  }
}


module.exports = authService;