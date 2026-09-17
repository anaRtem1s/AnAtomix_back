// REQUEST HANDLING LOGIC - ONE CONTROLLER PER RESSOURCE  - CONTROLLER EXTRACTS WHAT IT NEEDS FROM THE REQUEST - IT CALLS FUNCTION(S) FROM THE ACCOUNTSERVICE. IT SENDS BACK THE CORRECT CODES WITH THE DATA.

// CONTROLLER IS AN OBJECT CONTAINING SEVERAL FUNCTIONS (= FEATURES)

const accountService = require("../services/accountService.js");

// PSSWD HASH TOOL IF USER CHANGES IT

const argon2 = require('argon2');

const accountController = {

    // FIND ALL ACCOUNTS

    getAll: async (req, res) => {
        try {
            const accounts = await accountService.getAll();
            res.status(200).json(accounts);

        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured 🐾' + err });
        }
    },

    //  FIND ONE ACCOUNT BY ITS ID

    getById: async (req, res) => {
        try {
            const id = req.params.id;

            const account = await accountService.getById(id);

            if (!account) {
                res.status(404).json({ status: 404, message: `No account with ID ${id}, sorry` })
            }
            else {
                res.status(200).json(account);
            }
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured 🐾' + err });
        }
    },

    //  DELETE ONE ACCOUNT BY ITS ID

    delete: async (req, res) => {
        try {
            const id = req.params.id;

            // CHECKING IF ACCOUNT TO DELETE EXISTS IN DB

            const accountToDelete = await accountService.getById(id);

            if (!accountToDelete) {
                res.status(404).json({ status: 404, message: `No account with ID ${id}, sorry` })
            }
            else {
                const deleted = await accountService.delete(id);
                if (deleted) {

                    // NO CONTENT

                    res.sendStatus(204);
                }
                else {
                    throw new Error();
                }
            }
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while deleting your account 🐾' + err });
        }
    },

    // ADMIN ONLY

    deactivate: async (req, res) => {
        try {
            const id = req.params.id;

            const account = await accountService.getById(id);

            if (!account) {
                return res.status(404).json({ status: 404, message: `No account with ID ${id}, sorry` });
            }

            if (!account.is_active) {
                return res.status(409).json({ status: 409, message: 'This account is already deactivated' });
            }

            // GUARD : un admin ne peut pas se désactiver lui-même

            if (req.account && req.account.id === account.id) {
                return res.status(403).json({ status: 403, message: 'You cannot deactivate your own account' });
            }

            await accountService.update(id, { is_active: false });

            res.status(200).json({ message: 'Account deactivated' });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while deactivating the account 🐾' + err });
        }
    },

    //? ADMIN ONLY - RECHECK THAT THE USER CANNOT REACTIVATE

    reactivate: async (req, res) => {
        try {
            const id = req.params.id;

            const account = await accountService.getById(id);

            if (!account) {
                return res.status(404).json({ status: 404, message: `No account with ID ${id}, sorry` });
            }

            if (account.is_active) {
                return res.status(409).json({ status: 409, message: 'This account is already active' });
            }

            await accountService.update(id, { is_active: true });

            res.status(200).json({ message: 'Account reactivated' });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while reactivating the account 🐾' + err });
        }
    },

    //  UPDATE ONE ACCOUNT BY ITS ID

    update: async (req, res) => {
        try {
            const id = req.params.id;


            const account = await accountService.getById(id);

            if (!account) {

                return res.status(404).json({ status: 404, message: `No account with ID ${id}, sorry` });
            }

            const { email, username, newPassword } = req.body;

            if (!email && !username && !newPassword) {

                return res.status(400).json({ status: 400, message: 'Email, username, or new password are required' });

            } else if (username && email && newPassword) {

                // Update all three

                const passwordhash = await argon2.hash(newPassword); // HASHING NEW PSSWD

                await accountService.update(id, { username, email, passwordhash }); // USING NOW HASHED PSSWD

            } else if (username && email) {

                await accountService.update(id, { username, email });

            } else if (username && newPassword) {

                const passwordhash = await argon2.hash(newPassword); // HASHING NEW PSSWD

                await accountService.update(id, { username, passwordhash }); // USING NOW HASHED PSSWD

            } else if (email && newPassword) {

                const passwordhash = await argon2.hash(newPassword); // HASHING NEW PSSWD

                await accountService.update(id, { email, passwordhash }); // USING NOW HASHED PSSWD

            } else if (username) {

                await accountService.update(id, { username });

            } else if (email) {

                await accountService.update(id, { email });

            } else if (newPassword) {

                const passwordhash = await argon2.hash(newPassword); // HASHING NEW PSSWD

                await accountService.update(id, { passwordhash }); // USING NOW HASHED PSSWD
            }

            res.status(200).json({ message: 'Account updated' });
        }
        catch (err) {
            res.status(500).json({ status: 500, message: 'A server error occured while updating your account 🐾' + err });
        }
    }
}

module.exports = accountController;


