// ONE ROUTE PER FEATURE - EVERY ROUTE REDIRECTS TO MAIN ENTRYPOINT:ROUTE (= INDEX.JS)

const subscriptionController = require("../controllers/subscriptionController.js");
const authentication = require("../middlewares/authMiddleware.js");
const roleAuthorization = require("../middlewares/roleMiddlewareOLD.js");

const subscriptionValidator = require("../validators/subscriptionValidator.js");

const subscriptionRouter = require("express").Router();

//? http://localhost:PORT/api/subscriptions

subscriptionRouter.route('/')

  // LIST ALL SUBSCRIPTIONS
  .get(authentication(), roleAuthorization(['member', 'admin']), subscriptionController.getAll)

  // CREATE A SUBSCRIPTION
  .post(authentication(), roleAuthorization(['member', 'admin']), subscriptionValidator.validateCreateSubscription, subscriptionController.create)

//? http://localhost:PORT/api/subscriptions/:id

subscriptionRouter.route('/:id')

  // GET A SUBSCRIPTION
  .get(authentication(), roleAuthorization(['member', 'admin']), subscriptionController.getById)

  // UPDATE A SUBSCRIPTION
  .patch(authentication(), roleAuthorization(['member', 'admin']), subscriptionValidator.validateUpdateSubscriptionCategory, subscriptionController.update)

  // DELETE A SUBSCRIPTION
  .delete(authentication(), roleAuthorization(['member', 'admin']), subscriptionController.delete);

module.exports = subscriptionRouter;




