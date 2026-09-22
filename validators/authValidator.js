// AUTH / UPDATE VALIDATOR - INPUT VALIDATION SCHEMAS WITH ZOD -- MATCHING POSTGRESQL TABLE AND SEQUELIZE MODELS

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


// UPDATE | MODIFY AN ACCOUNT FIELD 


const UpdateAccountSchema = z.object({
    //  no empty-string sentinel. Omit a field to leave it unchanged. 

    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be 50 characters max')
        .transform(val => val.trim().toLowerCase()).optional(),
    email: z.string().regex(/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/, 'Invalid email format').max(255)
        .transform(val => val.trim().toLowerCase()).optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[a-z]/, 'Must contain a lowercase letter')
        .regex(/[0-9]/, 'Must contain a digit').regex(/[^A-Za-z0-9]/, 'Must contain a special character')
        .transform(val => val.trim()).optional()
}).refine((data) => data.username !== undefined || data.email !== undefined || data.newPassword !== undefined, {
    message: "At least one of username, email, or password must be provided."
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





