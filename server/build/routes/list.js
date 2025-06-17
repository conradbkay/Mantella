"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setListIdx = exports.deleteList = exports.createList = exports.editList = exports.validateSetListIdx = exports.validateDeleteList = exports.validateCreateList = exports.validateEditList = void 0;
const project_1 = require("../db/project");
const listUtils_1 = require("../db/listUtils");
const db_1 = require("../db/db");
const zod_1 = require("zod");
const toApi_1 = require("../db/toApi");
const validate_1 = require("../middleware/validate");
// Zod validation schemas
const editListSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    listId: zod_1.z.string().min(1, 'List ID is required'),
    newList: zod_1.z.object({
        name: zod_1.z.string().min(1, 'List name is required')
    })
});
const createListSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    name: zod_1.z.string().min(1, 'List name is required')
});
const deleteListSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    id: zod_1.z.string().min(1, 'List ID is required')
});
const setListIdxSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    listId: zod_1.z.string().min(1, 'List ID is required'),
    offset: zod_1.z.number()
});
exports.validateEditList = (0, validate_1.validateRequest)(editListSchema);
exports.validateCreateList = (0, validate_1.validateRequest)(createListSchema);
exports.validateDeleteList = (0, validate_1.validateRequest)(deleteListSchema);
exports.validateSetListIdx = (0, validate_1.validateRequest)(setListIdxSchema);
const editList = async (req, res, next) => {
    try {
        const { projId, listId, newList } = editListSchema.parse(req.body);
        await db_1.db
            .updateTable('lists')
            .set({ name: newList.name })
            .where('id', '=', listId)
            .execute();
        const project = await (0, toApi_1.getFullProject)(projId);
        const updatedList = project?.lists.find((l) => l.id === listId);
        res.json({
            project,
            list: updatedList
        });
    }
    catch (error) {
        next(error);
    }
};
exports.editList = editList;
const createList = async (req, res, next) => {
    try {
        const { projId, name } = createListSchema.parse(req.body);
        await (0, project_1.createList)(projId, name || 'New List');
        const project = await (0, toApi_1.getFullProject)(projId);
        // Assuming the new list is the last one created
        const newList = project?.lists[project.lists.length - 1];
        res.json({
            project,
            list: newList
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createList = createList;
const deleteList = async (req, res, next) => {
    try {
        const { projId, id } = deleteListSchema.parse(req.body);
        await db_1.db.deleteFrom('lists').where('id', '=', id).execute();
        const project = await (0, toApi_1.getFullProject)(projId);
        res.json({
            project
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteList = deleteList;
const setListIdx = async (req, res, next) => {
    try {
        const { projId, listId, offset } = setListIdxSchema.parse(req.body);
        // Get the current list to find its current order index
        const currentList = await db_1.db
            .selectFrom('lists')
            .select(['orderIndex'])
            .where('id', '=', listId)
            .where('projectId', '=', projId)
            .executeTakeFirst();
        if (!currentList || currentList.orderIndex === null) {
            return res.status(404).json({ error: 'List not found' });
        }
        const currentIndex = currentList.orderIndex;
        const newIndex = currentIndex + offset;
        // Get all lists in the project to validate bounds
        const allLists = await db_1.db
            .selectFrom('lists')
            .select(['id', 'orderIndex'])
            .where('projectId', '=', projId)
            .orderBy('orderIndex', 'asc')
            .execute();
        // Validate bounds
        if (newIndex < 0 || newIndex >= allLists.length) {
            return res
                .status(400)
                .json({ error: 'Invalid offset - would move list out of bounds' });
        }
        // Shift all lists between current and target position
        await (0, listUtils_1.shiftListOrder)(projId, currentIndex, newIndex);
        // Then move the current list to its new position
        await (0, listUtils_1.updateListOrder)(listId, newIndex);
        const project = await (0, toApi_1.getFullProject)(projId);
        res.json({ project });
    }
    catch (error) {
        next(error);
    }
};
exports.setListIdx = setListIdx;
//# sourceMappingURL=list.js.map