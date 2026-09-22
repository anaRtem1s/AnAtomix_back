// ARTICLE TAG INTERACTION VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

const { z } = require('zod');


const AssignArticleTagParamsSchema = z.object({

    article_id: z.coerce.number({ required_error: 'Article ID is required' })
        .int('Article ID must be an integer')
        .positive('Article ID must be a valid positive ID'),

    tag_id: z.coerce.number({ required_error: 'Tag ID is required' })
        .int('Tag ID must be an integer')
        .positive('Tag ID must be a valid positive ID')
});

// GENERIC MIDDLEWARE (PARAMS)

function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);

        if (result.success) {
            Object.assign(req.params, result.data); //  write back coerced numbers
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

const validateAssignArticleTag = validateParams(AssignArticleTagParamsSchema);

module.exports = { validateAssignArticleTag };