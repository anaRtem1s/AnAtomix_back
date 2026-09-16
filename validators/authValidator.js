// AUTH / UPDATE VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE

const { z } = require('zod');

// REGISTER FORM

const RegisterFormSchema = z.object({

    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be 50 characters max')
        // Force lowercase 
        .transform(val => val.trim().toLowerCase()),

    email: z.string()
        .regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/, 'Invalid email format')
        .max(255)
        // Force lowercase
        .transform(val => val.trim().toLowerCase()),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a digit')
        .regex(/[^A-Za-z0-9]/, 'Must contain a special character')
});

// LOGIN FORM : EMAIL OR USERNAME + PASSWORD

const LoginFormSchema = z.object({

    // If email is provided, force lowercase. If empty, keep empty.

    email: z.string().transform(val => val ? val.trim().toLowerCase() : '').optional(),

    // If username is provided, force lowercase. If empty, keep empty.

    username: z.string().transform(val => val ? val.trim().toLowerCase() : '').optional(),
    password: z.string().min(1, 'Password is required')

}).superRefine((form, ctx) => {

    // Check if BOTH are effectively empty after transform

    if (!form.email && !form.username) {
        ctx.addIssue({ code: 'custom', message: 'Provide an email or a username to log in' });
    }
});

// REUSING PSSWD REGEX RULES FROM REGISTER FORM

const passwordRules = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character');

// UPDATE | MODIFY AN ACCOUNT FIELD 

//! const UpdateAccountSchema = z.object({

//     // Optional, but normalizes if present

//     username: z.string().transform(val => val ? val.trim().toLowerCase() : '').optional(),

//     // Optional, but normalizes if present

//     email: z.string().max(255).transform(val => val ? val.trim().toLowerCase() : '').optional(),

//     newPassword: passwordRules.optional(),

// }).refine((data) => {
//     // Ensure at least one field is provided
//     return data.username || data.email || data.newPassword;
// }, {
//     message: "At least one of username, email, or new password must be provided."
// });


const UpdateAccountSchema = z.object({

    // Allow empty string OR valid username. Normalize if valid.
    username: z.union([z.string().min(3), z.literal('')])
        .transform(val => val === '' ? '' : val.trim().toLowerCase())
        .optional(),

    // Allow empty string OR valid email. Normalize if valid.

    email: z.union([z.string().regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/, 'Invalid email format').max(255), z.literal('')])
        .transform(val => val === '' ? '' : val.trim().toLowerCase())
        .optional(),

    // [LUMO FIX] Allow empty string OR valid password. Trim only (case-sensitive).
    // REMOVED passwordRules to avoid conflict with empty string.
    newPassword: z.union([
        z.string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain an uppercase letter')
            .regex(/[a-z]/, 'Must contain a lowercase letter')
            .regex(/[0-9]/, 'Must contain a digit')
            .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
        z.literal('') // Allow empty string explicitly
    ])
        .transform(val => val === '' ? '' : val.trim())
        .optional()
}).refine((data) => {
    // Ensure at least one field has a real value (not just empty string)
    return data.username || data.email || data.newPassword;
}, {
    message: "At least one of username, email, or newPassword must be provided."
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



const validateRegisterForm = validateBody(RegisterFormSchema);
const validateLoginForm = validateBody(LoginFormSchema);
const validateUpdateAccountForm = validateBody(UpdateAccountSchema);

module.exports = { validateRegisterForm, validateLoginForm, validateUpdateAccountForm };





