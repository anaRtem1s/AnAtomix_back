const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to my web server - AnAtomix || RSS & Atom feeds aggregator!')
});

const authRouter = require("./authRouter.js");
router.use('/auth', authRouter )

const accountRouter = require("./accountRouter.js");
router.use('/accounts', accountRouter)

const feedSourceRouter = require("./feedSourceRouter.js");
router.use('/feed_sources', feedSourceRouter)

const categoryRouter = require("./categoryRouter.js");
router.use('/categories', categoryRouter)

const tagRouter = require("./tagRouter.js");
router.use('/tags', tagRouter)

const subscriptionRouter = require("./subscriptionRouter.js");
router.use('/subscriptions', subscriptionRouter)

const feedArticleRouter = require("./feedArticleRouter.js");
router.use('/feed_articles', feedArticleRouter)


// Manages the personal account read / favorite status on articles 
const mm_accountArticleRouter = require("./mm_accountArticleRouter.js");
router.use('/account_articles', mm_accountArticleRouter);

// Manages the personal account's tags on articles 
const mm_articleTagRouter = require ("./mm_articleTagRouter.js");
router.use('/article_tags', mm_articleTagRouter);


module.exports = router;