const z = require("zod");


const categoryValidator = z.object({
    name : z.string(
        {
            error : (issue) => issue.input === undefined ? 'Category name is required' : 'The name must be a string (alphabet)'
        }
        )
        .max(200, 'Category name cannot exceed 255 characters...')
        .trim()
})

module.exports = categoryValidator;