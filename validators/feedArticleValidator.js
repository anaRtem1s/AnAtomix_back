// FEED ARTICLE VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE

const { z } = require('zod');

// CREATE FEED ARTICLE FORM

const CreateFeedArticleSchema = z.object({

  guid: z.string()
    .min(1, 'GUID identifier is required')
    .max(500, 'GUID must be 500 characters max')
    .transform(val => val.trim()),

  link: z.string()
    .regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid article URL format')
    .max(2048, 'Link must be 2048 characters max')
    .transform(val => val.trim()),

  title: z.string()
    .min(1, 'Title is required')
    .max(1000, 'Title must be 1000 characters max')
    .transform(val => val.trim()),

  summary: z.string()
    .transform(val => val ? val.trim() : null)
    .optional(),

  content_html: z.string()
    .transform(val => val ? val.trim() : null)
    .optional(),

  author: z.string()
    .max(500, 'Author name must be 500 characters max')
    .transform(val => val ? val.trim() : null)
    .optional(),


  published_at: z.iso.datetime({ message: 'Published date must be a valid ISO 8601 timestamp' })
    .optional(),


  updated_at: z.iso.datetime({ message: 'Updated date must be a valid ISO 8601 timestamp' })
    .optional(),

  feed_source_id: z.number({ required_error: 'Feed source reference ID is required' })
    .int('Feed source ID must be an integer')
    .positive('Feed source ID must be valid')
});

// UPDATE FEED ARTICLE FORM

const UpdateFeedArticleSchema = z.object({
  // omit to leave unchanged; empty string -> 400. Nullable text/date fields: send null to clear.
  guid: z.string().min(1).max(500).transform(val => val.trim()).optional(),
  link: z.string().regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid article URL format').max(2048)
    .transform(val => val.trim()).optional(),
  title: z.string().min(1).max(1000).transform(val => val.trim()).optional(),
  summary: z.string().min(1).transform(val => val.trim()).nullable().optional(),
  content_html: z.string().min(1).transform(val => val.trim()).nullable().optional(),
  author: z.string().min(1).max(500).transform(val => val.trim()).nullable().optional(),
  published_at: z.iso.datetime({ message: 'Published date must be a valid ISO 8601 timestamp' }).nullable().optional(),
  updated_at: z.iso.datetime({ message: 'Updated date must be a valid ISO 8601 timestamp' }).nullable().optional(),
  feed_source_id: z.number().int().positive().optional()
}).refine((data) => Object.values(data).some(v => v !== undefined), {
  message: "At least one field must be provided to update the feed article."
});


// GENERIC MIDDLEWARE : TURNS A SCHEMA INTO EXPRESS MIDDLEWARE

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



const validateCreateFeedArticle = validateBody(CreateFeedArticleSchema);
const validateUpdateFeedArticle = validateBody(UpdateFeedArticleSchema);

module.exports = { validateCreateFeedArticle, validateUpdateFeedArticle };