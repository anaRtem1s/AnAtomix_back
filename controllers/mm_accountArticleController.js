// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES) 

//! TO TEST - PROBABLY DOES NOT WORK

const mm_accountArticleService = require("../services/mm_accountArticleService.js");

const mm_accountArticleController = {

  // GET ALL READ / LOVED ARTICLE 

  //? GET	/api/read_loved

  getAll: async (req, res) => {
    try {
      const accountArticles = await mm_accountArticleService.getAll(req.account.id);
      res.status(200).json(accountArticles);
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching read / loved articles 🐾' + err });
    }
  },

  // GET A READ / LOVED ARTICLE BY ITS ID

  //? GET	/api//read_loved/:id

  getById: async (req, res) => {
    try {
      const article_id = req.params.id;
      const accountArticle = await mm_accountArticleService.getById(req.account.id,article_id);
      if (!accountArticle) {
        res.status(404).json({ status: 404, message: `No read / loved with ID ${article_id}, sorry` })
      }
      else {
        res.status(200).json(accountArticle);
      }
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while fetching read / loved article  🐾' + err});
    }
  },


  // CREATE A READ / LOVED ARTICLE 

  //? POST	/api//read_loved

  create: async (req, res) => {
    try {

      const { article_id, is_favorite } = req.body;

      const accountArticle = await mm_accountArticleService.create(
        {
          account_id: req.account.id,
          article_id: article_id,
          is_favorite
        });

      if (!accountArticle) {
        return res.status(404).json({ status: 404, message: `Could not create read / loved status on article, sorry` });
      }

      accountArticle.message = 'read / loved article created';
      res.status(200).json({ message: 'Read / loved status on article created', 'attributes': accountArticle });
    }
    catch (err) {
      res.status(500).json({ status: 500, message: 'A server error occured while creating  read / loved status on article 🐾: ' + err });
    }
  },
  // MARK AN ARTICLE AS UNREAD (Deletes the record)
  markAsUnread: async (req, res) => {
        try {
            const articleId = req.params.id;
            const accountId = req.account.id;

            const wasDeleted = await mm_accountArticleService.markAsUnread(accountId, articleId);

            if (!wasDeleted) {
                return res.status(404).json({ 
                    status: 404, 
                    message: `Article with ID ${articleId} was already unread or does not exist, sorry` 
                });
            }

            res.status(200).json({
                status: 200,
                message: 'Article marked as unread successfully'
            });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while resetting read status 🐾' + err.message });
        }
    },

    /**
     * PATCH /api/account_articles/{articleId}/favorite
     * @summary Toggle the favorite/love bookmark status of an article for the logged-in user
     * @tags Account Articles
     * @security BearerAuth
     * @param {number} articleId.path.required - Target Article ID
     * @return {FavoriteToggleResponse} 200 - Favorite status changed - application/json
     * @return 500 - Internal Server Error
     */

    // TOGGLE FAVORITE / LOVE STATUS ON AN ARTICLE
    toggleFavorite: async (req, res) => {
        try {
            const articleId = req.params.id;
            const accountId = req.account.id;

            const readFavouriteStatus = await mm_accountArticleService.toggleFavorite(accountId, articleId);

            if (!readFavouriteStatus) {
                return res.status(500).json({ status: 500, message: `Failed to update read / loved status on article with ID ${articleId}` });
            }

            res.status(200).json({ 
                message: 'read / loved status on article updated', 
                'attributes': readFavouriteStatus 
            });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while updating the read / loved status on article 🐾' + err.message });
        }
    }
}

module.exports = mm_accountArticleController;