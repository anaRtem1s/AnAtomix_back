const mm_articleTagService = require("../services/mm_articleTagService.js");

const mm_articleTagController = {
    /**
     * Article tag association detail structure
     * @typedef {object} ArticleTagInteraction
     * @property {number} article_id - Target article ID
     * @property {number} tag_id - Associated tag ID
     * @property {string} assigned_at - Timestamp showing when the tag was attached (ISO date)
     */

    /**
     * Custom tag info wrapper returned on successful article assignment
     * @typedef {object} ArticleTagAssignmentResponse
     * @property {string} message - Success statement string
     * @property {ArticleTagInteraction} attributes - Newly created or verified relation metadata
     */

    /**
     * List wrapper containing all tags attached to a specific article for the user
     * @typedef {object} ArticleTagListResponse
     * @property {number} status - HTTP status code matching the header
     * @property {string} message - Operational details
     * @property {array<object>} attributes - Array of Tag model objects owned by the account
     */

    /**
     * Standard message envelope for deletion or simple responses
     * @typedef {object} ArticleTagMessageResponse
     * @property {number} status - HTTP status code matching the header
     * @property {string} message - Operational details
     */

    getArticleTags: async (req, res) => {
        try {
            const articleTags = await mm_articleTagService.getArticleTags(req.account.id);
            res.status(200).json({
                status: 200,
                message: 'Article tags retrieved successfully',
                attributes: articleTags
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    },

    getArticleTagsByArticleId: async (req, res) => {
        try {
            const articleTags = await mm_articleTagService.getArticleTagsByArticleId(req.account.id, req.params.article_id);
            res.status(200).json({
                status: 200,
                message: 'Article tags retrieved successfully',
                attributes: articleTags
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    },

    getArticleTagsByTagId: async (req, res) => {
        try {
            const articleTags = await mm_articleTagService.getArticleTagsByTagId(req.account.id, req.params.tag_id);
            res.status(200).json({
                status: 200,
                message: 'Article tags retrieved successfully',
                attributes: articleTags
            });
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    },

    getArticleTag: async (req, res) => {
        try {
            const articleTag = await mm_articleTagService.getArticleTag(req.account.id, req.params.article_id, req.params.tag_id);
            if (articleTag) {
                res.status(200).json({
                    status: 200,
                    message: 'Article tags retrieved successfully',
                    attributes: articleTag
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'A server error occurred while fetching article tags 🐾 '
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    },
    createArticleTag: async (req, res) => {
        try {
            const created = await mm_articleTagService.createArticleTag(req.account.id, req.params.article_id, req.params.tag_id);
            if (created) {
                res.status(200).json({
                    status: 200,
                    message: 'Article tags created successfully',
                    attributes: created
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'A server error occurred while creating article tags 🐾 '
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    },
    deleteArticleTag: async (req, res) => {
        try {
            const deleted = await mm_articleTagService.deleteArticleTag(req.account.id, req.params.article_id, req.params.tag_id);
            if (deleted) {
                res.status(200).json({
                    status: 200,
                    message: 'Article tags deleted successfully',
                    attributes: deleted
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: 'A server error occurred while deleting article tags 🐾 '
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 500,
                message: 'A server error occurred while fetching article tags 🐾 ' + err.message
            });
        }
    }
};

module.exports = mm_articleTagController;