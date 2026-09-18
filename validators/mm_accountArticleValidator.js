// ACCOUNT-ARTICLE INTERACTION (TOGGLE FAV) VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS 

const z = require("zod");

const UpdateArticleInteractionSchema = z.object({

  is_favorite: z.boolean({ required_error: 'Favorite status must be a boolean flag' })
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


const validateUpdateArticleInteraction = validateBody(UpdateArticleInteractionSchema);


module.exports = { validateUpdateArticleInteraction };