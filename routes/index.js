const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to my web API - RSS:Atom feeds aggregator!')
});

const authRouter = require("./authRouter.js");
router.use('/auth', authRouter )

const accountRouter = require("./accountRouter.js");
router.use('/accounts', accountRouter)

const feedSourceRouter = require("./feedSourceRouter.js");
router.use('/feed_sources', feedSourceRouter)

module.exports = router;