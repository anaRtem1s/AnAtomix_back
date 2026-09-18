// SUBSCRIBTION TO A FEED SOURCE VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

const { z } = require('zod');

const CreateSubscriptionSchema = z.object({

    feed_source_id: z.number({ required_error: 'Feed source ID is required' })
        .int('Must be an integer')
        .positive('Must be a valid ID'),

    category_id: z.number()
        .int('Must be an integer')
        .positive('Must be a valid ID')
        .nullable()
        .optional()
});

const UpdateSubscriptionCategorySchema = z.object({

    category_id: z.number({ required_error: 'Category ID selection is required' })
        .int('Must be an integer')
        .positive('Must be a valid ID')
        .nullable()
});

// ==========================================
// GENERIC MIDDLEWARE 
// ==========================================

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


const validateCreateSubscription = validateBody(CreateSubscriptionSchema);
const validateUpdateSubscriptionCategory = validateBody(UpdateSubscriptionCategorySchema);


module.exports = { validateCreateSubscription, validateUpdateSubscriptionCategory };
  
