const db = require("../models/configDB");

const accountService = {

    // FIND ALL ACCOUNTS

    getAll: async () => {
        try {
            const accounts = await db.account.findAll(
                { attributes: { exclude: 'passwordhash' } });
            return accounts;
        }
        catch (err) {
            throw new Error(err.message);
        }
    },

    // FIND ONE ACCOUNT BY ID

    getById: async (id) => {
        try {
            const accountFound = await db.account.findByPk(id, { attributes: { exclude: 'passwordhash' } });
            return accountFound;
        }
        catch (err) {
            throw new Error(err.message);
        }
    },

    // HARD DELETE ACCOUNT

    delete: async (id) => {
        try {
            const deletedRows = await db.account.destroy({ where: { id } });

            if (deletedRows === 1) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            throw new Error(err.message);
        }
    },

    // SOFT DELETE ACCOUNT (DEACTIVATE / REACTIVATE)

    update: async (id, changes) => {
        try {
            const [updatedRows] = await db.account.update(changes, { where: { id: id } });

            // RETURN TRUE IF AT LEAST ONE ROW WAS MODIFIED

            return updatedRows === 1;
        }
        catch (err) {
            throw new Error(err.message);
        }
    },
}

module.exports = accountService;