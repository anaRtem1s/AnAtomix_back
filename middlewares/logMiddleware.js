
// MIDDLEWARE = FUNCTION THAT SENDS BACK THE REQUEST

const logMiddleware = () => {


    // req = request
    // res = response
    // next = function to continue the request

    return (req, res, next) => {
        console.log(`Request received ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`);
        console.log(`[${ req.method }] ${ req.url } `);
        
        next(); // request continues
    }
}

module.exports = logMiddleware;