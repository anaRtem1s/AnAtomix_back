// ==========================================
// 1. FEED SOURCE INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

// VALIDATOR MODULE FOR CORE TABLES WITH ZOD -- MATCHING POSTGRESQL SCHEMAS

const { z } = require('zod');

const CreateFeedSourceSchema = z.object({

  feed_url: z.string()
    .regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid feed URL format')
    .max(2048, 'URL must be 2048 characters max')
    .transform(val => val.trim()),

  feed_type: z.enum(['rss', 'atom'], {
    errorMap: () => ({ message: "Feed type must be exactly 'rss' or 'atom'" })
  }),

  title: z.string()
    .min(1, 'Title is required')
    .max(256, 'Title must be 256 characters max')
    .transform(val => val.trim()),

  descr: z.string()
    .transform(val => val ? val.trim() : null)
    .optional(),

  site_url: z.string()
    .regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid site URL format')
    .max(2048, 'URL must be 2048 characters max')
    .transform(val => val ? val.trim() : null)
    .optional()
});

// UPDATE FEED SOURCE (ADMIN)

const UpdateFeedSourceSchema = z.object({
  // omit to leave unchanged; empty string -> 400. Nullable text fields: send null to clear.
  feed_url: z.string().regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid feed URL format').max(2048)
    .transform(val => val.trim()).optional(),
  feed_type: z.enum(['rss', 'atom']).optional(),
  title: z.string().min(1).max(256).transform(val => val.trim()).optional(),
  descr: z.string().min(1).transform(val => val.trim()).nullable().optional(),
  site_url: z.string().regex(/^(https?:\/\/)[^\s$.?#].[^\s]*$/i, 'Invalid site URL format').max(2048)
    .transform(val => val.trim()).nullable().optional()
}).refine((data) => [data.feed_url, data.feed_type, data.title, data.descr, data.site_url].some(v => v !== undefined), {
  message: "At least one field must be provided to update the feed source."
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


const validateCreateFeedSource = validateBody(CreateFeedSourceSchema);
const validateUpdateFeedSource = validateBody(UpdateFeedSourceSchema);


module.exports = { validateCreateFeedSource, validateUpdateFeedSource };