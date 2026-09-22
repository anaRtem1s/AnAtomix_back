// TAG VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

const z = require("zod");

// CREATE TAG FORM - Only validate frontend form

const CreateTagSchema = z.object({
    title: z.string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(256)
        .transform(val => val.trim()),

    color: z.string()
        .max(32)
        .regex(/^#([A-Fa-f0-9]{3,8})$|^rgba?\(.+\)$/, 'Invalid color format')
        .transform(val => val.trim())
        .nullable()
        .optional()
});

// UPDATE TAG FORM 

const UpdateTagSchema = z.object({
    //  omit to leave unchanged; empty string -> 400.
    title: z.string().min(1).max(256).transform(val => val.trim()).optional(),
    //  color is clearable -> send null to clear; '' -> 400.
    color: z.string().max(32).regex(/^#([A-Fa-f0-9]{3,8})$|^rgba?\(.+\)$/, 'Invalid color format')
        .transform(val => val.trim()).nullable().optional()
}).refine((data) => data.title !== undefined || data.color !== undefined, {
    message: "At least one of title or color must be provided."
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


const validateCreateTag = validateBody(CreateTagSchema);
const validateUpdateTag = validateBody(UpdateTagSchema);

module.exports = { validateCreateTag, validateUpdateTag };
