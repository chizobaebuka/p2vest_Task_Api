"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the column exists before attempting to remove it
            const table = yield queryInterface.describeTable('tasksTable');
            if (table['assignedToId']) {
                yield queryInterface.removeColumn('tasksTable', 'assignedToId');
            }
            // Optionally, drop the table if needed
            yield queryInterface.dropTable('tasksTable');
        });
    },
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // Optionally recreate the table with original columns if necessary
            yield queryInterface.createTable('tasksTable', {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.ENUM('Pending', 'In Progress', 'Completed'),
                    allowNull: false,
                    defaultValue: 'Pending',
                },
                createdById: {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: 'usersTable',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            });
        });
    }
};
