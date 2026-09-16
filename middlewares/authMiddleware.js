const { Request, Response } = require('express')

const jwtUtils = require("../services/auth/utils/jwtUtils.js"); 

const authentication = () => {
  
  /**
  * @param { Request } req
  * @param { Response } res
  */
  return async (req, res, next) => {
    
    // RETRIEVING TOKEN FROM THE REQUEST
    
    const authorization = req.headers.authorization;
    
    // CHECKING IF A TOKEN IS PRESENT
    // IF AUTHORIZATION IS EMPTY (NEVER PROVIDED) -> ENDING REQUEST WITH ERROR 401
    
    if(!authorization) {
      // On met fin à la requête avec une erreur 401
      return res.status(401).json({ status : 401, message : 'You must be logged in to access this ressource'})
    }
    
    // IF AUTHORIZATION IS NOT EMPTY BUT TOKEN IS INCORRECT
    // IF PROVIDED, AUTHORIZATION LOOKS LIKE "Bearer yourToken". WE NEED TO EXTRACT "yourToken"
    // REMINDER : string.split(character) CUTS THE STRING EVERYWHERE THE CHARACTER IS FOUND AND RETURNS AN ARRAY WITH EACH PIECE
    // HERE WE CUT AT THE SPACE : "Bearer" IN SLOT 0 AND "yourToken" IN SLOT 1
    
    const token = authorization.split(' ')[1];
    
    // IF NO TOKEN OBTAINED AFTER SPLIT -> ERROR 401
    
    if(!token) {
      
      return res.status(401).json({ status : 401, message : 'You must be logged in to access this ressource'})
    }
    
    // IF A TOKEN IS PRESENT, VERIFYING ITS VALIDITY
    try {
      
      //  This will throw an error if the token cannot be verified, that is, its signature fails.
      const payload = await jwtUtils.decode(token);
      
      // STORING PAYLOAD INFO IN THE REQUEST OBJECT SO NEXT MIDDLEWARES OR CONTROLLERS DON'T NEED TO DECODE THE TOKEN AGAIN
      // In other words, now req contains the account information.
      
      req.account = payload;
      
      // CONTINUING THE REQUEST
      
      next();
      
    } catch(err){
      
      // INVALID OR EXPIRED TOKEN -> 401
      // Expired = the token is too old OR there was tampering on the token.
      
       res.status(401).json({ status : 401, message : 'You must be logged in to access this ressource'})
    }
  }
}

module.exports = authentication;