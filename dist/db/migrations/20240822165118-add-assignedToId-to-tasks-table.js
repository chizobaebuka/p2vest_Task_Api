"use strict";
// src/db/migrations/20240821235959-add-assigned-to-id-to-tasks.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.addColumn('tasksTable', 'assignedToId', {
                type: Sequelize.UUID,
                allowNull: true, // Assignment is optional
            });
            // Add foreign key constraint for assignedToId
            yield queryInterface.addConstraint('tasksTable', {
                fields: ['assignedToId'],
                type: 'foreign key',
                name: 'fk_tasks_assigned_to',
                references: {
                    table: 'usersTable', // The name of the user table
                    field: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            });
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove foreign key constraint
            yield queryInterface.removeConstraint('tasksTable', 'fk_tasks_assigned_to');
            // Remove the assignedToId column
            yield queryInterface.removeColumn('tasksTable', 'assignedToId');
        });
    },
};
