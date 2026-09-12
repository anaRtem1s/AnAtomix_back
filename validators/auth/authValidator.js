// AUTH VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE

const { z } = require('zod');

// REGISTER FORM

const RegisterFormSchema = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be 50 characters max'),
    email: z.string().email('Invalid email format').max(255),
    password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character')
});

// LOGIN FORM : EMAIL OR USERNAME + PASSWORD

const LoginFormSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(1).optional(),
    password: z.string().min(1, 'Password is required')
}).superRefine((form, ctx) => {
    if (!form.email && !form.username) {
        ctx.addIssue({
            code: 'custom',
            message: 'Provide an email or a username to log in'
        });
    }
});

// GENERIC MIDDLEWARE : TURNS A SCHEMA INTO EXPRESS MIDDLEWARE

function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        
        if (result.success) {
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

const validateRegisterForm = validateBody(RegisterFormSchema);
const validateLoginForm = validateBody(LoginFormSchema);

module.exports = { validateRegisterForm, validateLoginForm };