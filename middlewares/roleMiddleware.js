// ROLE AUTHORIZATION MIDDLEWARE - CHECKS IF THE CONNECTED ACCOUNT HAS AN ALLOWED ROLE
// MUST BE PLACED AFTER authentication() IN THE ROUTE (IT READS req.account)

const accountService = require("../services/accountService")

const roleAuthorization = (roles /* ALLOWED ROLES (member, admin, self) */) => {
  // Self is a special case, where the role in DB can never take self, but it implies that if the allowed roles do not cover you, then if self is present in this list, you can do actions for your own id
  
  return async (req, res, next) => {
    
    // GETTING THE CONNECTED ACCOUNT'S ID (STORED BY THE AUTH MIDDLEWARE)
    const accountId = req.account.id;
  
    
    // EXTRACTING ROLE FROM TOKEN - NOW ACTIVELY USED TO AVOID UNNECESSARY DB CALLS
    const accountRole = req.account.role;
    
    // 1. FAST TRACK: IF TOKEN ROLE IS ALREADY ALLOWED, WE TRUST IT AND PASS IMMEDIATELY
    if (roles.includes(accountRole)) {
      next();
    }
    // 2. IF NOT ON THE FAST TRACK, WE FETCH FROM DB FOR SECURITY (CHECK "self" OR RECENT CHANGES)
    else {
      try {
        const account = await accountService.getById(accountId);
        
        // IF ACCOUNT = NOT FOUND (DELETED FROM THE DB)
        if (!account) {
          res.status(403).json({ status: 403, message: "You are not allowed to access this route" })
        }
        else {
          // IF WE HAVE AN ACCOUNT, WE CHECK THEIR LIVE ROLE IS PART OF THE ALLOWED ROLES + CHECKING IF ACCOUNT IS STILL ACTIVE
          if (roles.includes(account.role) && account.is_active) {
            next();
          }
          // IF WE HAVE AN ACCOUNT, AND THEIR LIVE ROLE FAILED, WE CHECK FOR "self" AND ID MATCH
          else if (roles.includes("self") && account.is_active && accountId == req.params.id) {
            next();
          }
          else {
            res.status(403).json({ status: 403, message: "You are not allowed to access this route" })
          }
        }
      }
      catch (err) {
        res.status(500).json({ status : 500, message : 'A server error occured 🐾' + err});
      } 
    }
  }
}

module.exports = roleAuthorization;