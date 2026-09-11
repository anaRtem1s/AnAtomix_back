// ROLE AUTHORIZATION MIDDLEWARE - CHECKS IF THE CONNECTED ACCOUNT HAS AN ALLOWED ROLE
// MUST BE PLACED AFTER authentication() IN THE ROUTE (IT READS req.account)

const accountService = require("../../services/account/accountService")

const roleAuthorization = (roles /* ALLOWED ROLES (member, admin) */) => {
  
  
  return async (req, res, next) => {
    
    // GETTING THE CONNECTED ACCOUNT'S ID (STORED BY THE AUTH MIDDLEWARE)
    
    const accountId = req.account.id;
    
    //const userRole = req.user.role;
    
    //  EVEN THOUGH THE ROLE WAS EXTRACTED FROM THE TOKEN, FOR SAFETY WE FETCH THE ROLE FROM THE DB - IT MAY HAVE CHANGED SINCE (PROMOTION, DEACTIVATION...)
    try {
      const account = await accountService.getById(accountId);
      
      // IF  ACCOUNT = NOT FOUND (DELETED FROM THE DB)
      
      if (!account) {
        res.status(403).json({ status: 403, message: "You are not allowed to access this route" })
      }
      else {
        // IF WE HAVE AN ACCOUNT, WE CHECK THEIR ROLE IS PART OF THE ALLOWED ROLES + CHECKING IF ACCOUNT IS STILL ACTIVE
        
        if (roles.includes(account.role) && account.is_active) {
          next();
        }
        else {
          res.status(403).json({ status: 403, message: "You are not allowed to access this route" })
        }
      }
    }
    catch (err) {
      
      
      res.status(500).json({ status : 500, message : 'An error occurred'});
    } 
  }
}

module.exports = roleAuthorization;