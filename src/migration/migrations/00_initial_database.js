(() => {
    "use strict";

    /**
     * Returns whether database already contains initial tables
     * 
     * @param {Object} query query interface
     * @returns {Promise} promise for boolean containig whether database already contains initial tables
     */
    const isAlreadyMigrated = (query) => {
        return new Promise((resolve) => {
            query.describeTable("Sessions")
                .then((result) => {
                    resolve(!!result);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    };

    module.exports = {

        up: async (query, Sequelize) => {
            const alreadyMigrated = await isAlreadyMigrated(query);
            if (alreadyMigrated) {
                return Promise.resolve();
            }

            await query.createTable("Characters", {
                id: { type: Sequelize.UUID, primaryKey: true, allowNull: false, unique: true },
                name: { type: Sequelize.STRING(191), allowNull: false, unique:true },
                classType: { type: Sequelize.STRING(191), allowNull: false},
                userId: { type: Sequelize.UUID, allowNull: false },
                statsId: { type: Sequelize.UUID, allowNull: false },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            });
        }
    };

})();