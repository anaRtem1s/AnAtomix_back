// ARTICLE TAG INTERACTION VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

const { z } = require('zod');

// ASSIGN TAG TO ARTICLE FORM

const AssignArticleTagSchema = z.object({

    article_id: z.number({ required_error: 'Article ID is required' })
        .int('Article ID must be an integer')
        .positive('Article ID must be a valid positive ID'),

    tag_id: z.number({ required_error: 'Tag ID is required' })
        .int('Tag ID must be an integer')
        .positive('Tag ID must be a valid positive ID')
});


// GENERIC MIDDLEWARE 

function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (result.success) {
            req.body = result.data;
            next();
        } else {
            return res.status(400).json({
                status: 400,
                message: 'Invalid input',
                details: result.error.issues
            });
        }
    };
}


const validateAssignArticleTag = validateBody(AssignArticleTagSchema);

module.exports = { validateAssignArticleTag };