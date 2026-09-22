const z = require("zod");


// CREATE CATEGORY FORM - validates fields coming from the user

const CreateCategorySchema = z.object({

    title: z.string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(255, 'Title must be 255 characters max')
        .transform(val => val.trim())

    //? account_id => The backend pulls from req.user 

});

// UPDATE CATEGORY FORM

const UpdateCategorySchema = z.object({
    // omit to leave unchanged; empty string -> 400.
    title: z.string().min(1, 'Title cannot be empty').max(255, 'Title must be 255 characters max')
        .transform(val => val.trim()).optional()
}).refine((data) => data.title !== undefined, {
    message: "A title must be provided to update the category."
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
const validateCreateCategory = validateBody(CreateCategorySchema);
const validateUpdateCategory = validateBody(UpdateCategorySchema);

module.exports = { validateCreateCategory, validateUpdateCategory };

