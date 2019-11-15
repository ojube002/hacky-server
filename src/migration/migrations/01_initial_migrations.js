(() => {
    "use strict";

    module.exports = {

        up: async (query, Sequelize) => {

            await query.createTable("Stats", {
                id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
                characterId: { type: Sequelize.UUID, allowNull: false },
                level: { type: Sequelize.STRING(191), allowNull: false },
                experience: { type: Sequelize.STRING(191), allowNull: false },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            });

        }

    };

})();