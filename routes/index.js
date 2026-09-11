const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to my web API - RSS:Atom feeds aggregator!')
});

const authRouter = require("./auth/authRouter.js");
router.use('/auth', authRouter )

const accountRouter = require("./account/accountRouter.js");
router.use('/accounts', accountRouter)

module.exports = router;