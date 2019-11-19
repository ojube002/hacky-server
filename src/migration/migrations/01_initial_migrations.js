(() => {
    "use strict";

    module.exports = {

        up: async (query, Sequelize) => {

            await query.createTable("Stats", {
                id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
                level: { type: Sequelize.BIGINT, defaultValue: 1, allowNull: false },
                experience: { type: Sequelize.BIGINT, allowNull: false },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            });

        }

    };

})();