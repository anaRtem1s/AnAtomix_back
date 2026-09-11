// JWT AUTH TOOL FILE - GENERATES AND VERIFIES TOKENS

const jwt = require("jsonwebtoken");

const { JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET } = process.env;

const jwtUtils = {
  
  generate : (account) => {
    
    // TOKEN CREATION CAN FAIL => CREATION OF A PROMISE
    
    return new Promise( (resolve, reject) => { 
      
      // PAYLOAD CREATION ==> OBJECT CONTAINING DATA THAT WE WANT TO STORE INSIDE THE TOKEN // ⚠️ NO sensitive data
      
      // CLAIMS => DATA STORED INSIDE PAYLOAD
      
      const payload = {
        id : account.id,
        role : account.role
      }
      
      // DEFINING PAYLOAD OPTIONS 
      
      const options = {
        
        // TOKEN HASH ALGORITHM
        
        algorithm : 'HS512',
        
        // TOKEN EXPIRATION DATE
        
        expiresIn : '12h',
        
        // WHO IS THE TOKEN FOR
        
        audience : JWT_AUDIENCE,
        
        //  WHO CREATED THE TOKEN
        
        issuer : JWT_ISSUER
      }
      
      // CREATING THE TOKEN WITH SIGN() WHICH TAKES PARAMETERS:
      // - PAYLOAD
      // - SECRET 
      // - OPTIONS
      // - CALLBACK, RETURNING THE TOKEN OR AN ERROR
      
      jwt.sign(payload, JWT_SECRET, options, (error, token) => {
        
        if(error){
          reject(error); 
        }
        
        else {
          resolve(token);
        }
      } )
    })
  },
  
  decode : (token) => {
    return new Promise( (resolve, reject) => {
      
      // CHECKING IF TOKEN PARAMETER IS PROVIDED
      
      if(!token){
        
        return reject(new Error('No token provided'));
        
      }
      
      const options = {
        audience : JWT_AUDIENCE,
        issuer : JWT_ISSUER
      }
      
      // VERIFYING THE TOKEN
      // WE USE VERIFY (NOT DECODE!) BECAUSE VERIFY CHECKS :
      // - THE SIGNATURE (TOKEN NOT FORGED)
      // - THE ISSUER AND AUDIENCE (RIGHT SOURCE, RIGHT DESTINATION)
      // - THE EXPIRATION DATE
      // IT THROWS IF ANY CHECK FAILS -> CAUGHT BY THE MIDDLEWARE -> 401
      
      jwt.verify(token, JWT_SECRET, options, (error, payload) => {
        
        // IF VERIFICATION FAILS, WE REJECT WITH THE ERROR
        if(error){
          
          reject(error);
        }
        // IF VERIFICATION SUCCEEDS, WE RESOLVE WITH THE PAYLOAD EXTRACTED FROM THE TOKEN
        else {
          resolve(payload);
        }
      } )
    })
  }
}

module.exports = jwtUtils;