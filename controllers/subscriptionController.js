// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES) 


const subscriptionService = require("../services/subscriptionService.js");

const subscriptionController = {

  /**
    * Subscription creation form model
    * @typedef {object} SubscriptionCreateForm
    * @property {number} feed_source_id.required - ID of the target feed source
    * @property {number} category_id - Optional ID of the associated category (can be null)
    */

  /**
   * Subscription update form model
   * @typedef {object} SubscriptionUpdateForm
   * @property {number} category_id - ID of the new category association (can be null)
   */

  /**
   * Base subscription details structure
   * @typedef {object} SubscriptionDetails
   * @property {number} id - Unique identifier
   * @property {number} account_id - Owner account ID
   * @property {number} feed_source_id - Associated feed source ID
   * @property {number} category_id - Associated category ID (nullable)
   */

  /**
   * Subscription info wrapper returned on creation success
   * @typedef {object} SubscriptionCreatedResponse
   * @property {string} message - Success message
   * @property {SubscriptionDetails} attributes - The created subscription data
   */

  /**
   * Subscription info returned on update success
   * @typedef {object} SubscriptionUpdatedResponse
   * @property {string} message - Success message
   * @property {number} category_id - The updated category configuration
   */

  /**
   * Standard message envelope for deletion or simple responses
   * @typedef {object} SubscriptionMessageResponse
   * @property {number} status - HTTP status code matching the header
   * @property {string} message - Operational details
   */

  /**
   * GET /api/subscriptions
   * @summary Get all subscriptions for the authenticated account
   * @tags Subscriptions
   * @security BearerAuth
   * @return {array<SubscriptionDetails>} 200 - List of subscriptions - application/json
   * @return 500 - Internal Server Error
   */

  // GET ALL SUBSCRIPTIONS FOR AN ACCOUNT

  //? GET	/api/subscriptions

  getAll: async (req, res) => {
    try {
      const subscriptions = await subscriptionService.getAll(req.account.id);
      res.status(200).json(subscriptions);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching subscriptions 🐾' + err });
    }
  },

  /**
   * GET /api/subscriptions/{id}
   * @summary Get a subscription by its ID
   * @tags Subscriptions
   * @security BearerAuth
   * @param {number} id.path.required - Subscription ID
   * @return {SubscriptionDetails} 200 - Subscription details - application/json
   * @return 404 - Not Found (subscription doesn't exist or belongs to another account)
   * @return 500 - Internal Server Error
   */

  // GET A SUBSCRIPTION BY ITS ID

  //? GET	/api/subscriptions/:id

  getById: async (req, res) => {
    try {
      const id = req.params.id;

      const subscription = await subscriptionService.getById(id);

      if (!subscription || subscription.account_id !== req.account.id) {
        res.status(404).json({ status: 404, message: `No subscription with ID ${id}, sorry` })
      }
      else {
        res.status(200).json(subscription);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching subscription 🐾' + err });
    }
  },

  /**
  * POST /api/subscriptions
  * @summary Create a new subscription to a feed
  * @tags Subscriptions
  * @security BearerAuth
  * @param {SubscriptionCreateForm} request.body.required - Subscription initialization details - application/json
  * @return {SubscriptionCreatedResponse} 200 - Subscription created successfully - application/json
  * @return 400 - Bad Request (missing feed_source_id or already subscribed)
  * @return 404 - Not Found (creation process failed)
  * @return 500 - Internal Server Error
  */

  // CREATE A SUBSCRIPTION

  //? POST	/api/subscriptions/
  create: async (req, res) => {
    try {

      const { feed_source_id, category_id } = req.body;

      //? CHECKING MANDATORY FIELDS 
      // Category id can be NULL which means unspecified
      if (!feed_source_id) {
        return res.status(400).json({ status: 400, message: 'feed_source_id is required' });
      }

      const subscription = await subscriptionService.create(
        {
          account_id: req.account.id,
          feed_source_id,
          category_id
        });

      if (!subscription) {
        return res.status(404).json({ status: 404, message: `Could not create subscription to feed, sorry` });
      }

      subscription.message = 'subscription created';
      res.status(200).json({ message: 'subscription to feed created', 'attributes': subscription });
    }
    catch (err) {
      // 🚩 INTERCEPTING SEQUELIZE UNIQUE CONSTRAINT VALIDATION ERRORS BEFORE SENDING A CRASH STATUS
      if (err.name === 'SequelizeUniqueConstraintError' || (err.message && err.message.includes('Validation error'))) {
        return res.status(400).json({ status: 400, message: 'You are already subscribed to this feed source! 📰' });
      }

      res.status(500).json({ status: 500, message: 'A server error occured while creating subscription to feed 🐾: ' + err });
    }
  },

  /**
 * DELETE /api/subscriptions/{id}
 * @summary Delete a subscription by its ID
 * @tags Subscriptions
 * @security BearerAuth
 * @param {number} id.path.required - Subscription ID
 * @return {SubscriptionMessageResponse} 200 - Subscription deleted successfully - application/json
 * @return 404 - Not Found (subscription doesn't exist, belongs to another account, or deletion failed)
 * @return 500 - Internal Server Error
 */

  // DELETE A SUBSCRIPTION

  //? DELETE /api/subscriptions/:id

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      // CHECKING IF SUBSCRIPTION TO DELETE EXISTS IN DB

      const subscription = await subscriptionService.getById(id);

      if (!subscription || subscription.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No subscription with ID ${id}, sorry` })
      }
      else {

        const deleted = await subscriptionService.delete(id);

        if (deleted) {

          // 204 DOES NOT ACCEPT BODY, SO 200 HERE

          res.status(200).json({
            status: 200,
            message: 'subscription deleted successfully'
          });
        }
        else {
          res.status(404).json({
            status: 404,
            message: `Could not delete subscription with ID ${id}`
          });
        }
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while deleting the subscription 🐾' + err });
    }
  },
  /**
     * PATCH /api/subscriptions/{id}
     * @summary Update an existing subscription's category association
     * @tags Subscriptions
     * @security BearerAuth
     * @param {number} id.path.required - Subscription ID
     * @param {SubscriptionUpdateForm} request.body.required - Category mapping detail to modify - application/json
     * @return {SubscriptionUpdatedResponse} 200 - Subscription updated parameters - application/json
     * @return 404 - Not Found (subscription doesn't exist or belongs to another account)
     * @return 500 - Internal Server Error (failed to update row entity mapping)
     */


  // UPDATE A SUBSCRIPTION

  //? PATCH	/api/subscriptions/:id

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const subscription = await subscriptionService.getById(id);

      if (!subscription || subscription.account_id !== req.account.id) {
        return res.status(404).json({ status: 404, message: `No subscription with ID ${id}, sorry` });
      }

      const { category_id } = req.body;

      const updated = await subscriptionService.update(id, { category_id });

      if (!updated) {
        return res.status(500).json({ status: 500, message: `Failed to update subscription with ID ${id}`, updated });
      }

      res.status(200).json({ message: 'subscription updated', category_id });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while updating the subscription 🐾' + err });
    }
  }
}

module.exports = subscriptionController;