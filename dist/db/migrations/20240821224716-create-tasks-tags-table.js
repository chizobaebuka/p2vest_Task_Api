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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable('TaskTags', {
                taskId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'tasksTable', // Table name for TaskModel
                        key: 'id',
                    },
                    allowNull: false,
                },
                tagId: {
                    type: Sequelize.UUID,
                    references: {
                        model: 'tagsTable', // Table name for TagModel
                        key: 'id',
                    },
                    allowNull: false,
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
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable('TaskTags');
        });
    },
};
