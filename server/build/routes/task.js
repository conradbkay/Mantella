"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserToTask = exports.setComment = exports.setSubtask = exports.replaceListIds = exports.dragTask = exports.deleteTask = exports.editTask = exports.createTask = exports.validateAssignUserToTask = exports.validateSetComment = exports.validateSetSubtask = exports.validateDragTask = exports.validateDeleteTask = exports.validateEditTask = exports.validateCreateTask = void 0;
const project_1 = require("../db/project");
const nanoid_1 = require("nanoid");
const taskPositions_1 = require("../db/taskPositions");
const toApi_1 = require("../db/toApi");
const db_1 = require("../db/db");
const zod_1 = require("zod");
const validate_1 = require("../middleware/validate");
// Zod validation schemas
const createTaskSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    listId: zod_1.z.string().min(1, 'List ID is required'),
    taskInfo: zod_1.z.object({
        name: zod_1.z.string().optional(),
        points: zod_1.z.number().optional(),
        color: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        subTasks: zod_1.z.array(zod_1.z.any()).optional()
    })
});
const editTaskSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    task: zod_1.z.any()
});
const deleteTaskSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    id: zod_1.z.string().min(1, 'Task ID is required')
});
const dragTaskSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'Project ID is required'),
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    toListId: zod_1.z.string().min(1, 'List ID is required'),
    toProgress: zod_1.z.number(),
    toIdx: zod_1.z.number()
});
const setSubtaskSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    subtaskId: zod_1.z.string().min(1, 'Subtask ID is required'),
    info: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        completed: zod_1.z.boolean().optional(),
        orderIndex: zod_1.z.number().optional()
    })
        .optional()
});
const setCommentSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    commentId: zod_1.z.string().min(1, 'Comment ID is required'),
    description: zod_1.z.string().min(1, 'Description is required')
});
const assignUserToTaskSchema = zod_1.z.object({
    projId: zod_1.z.string().min(1, 'Project ID is required'),
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    userId: zod_1.z.string().min(1, 'User ID is required')
});
exports.validateCreateTask = (0, validate_1.validateRequest)(createTaskSchema);
exports.validateEditTask = (0, validate_1.validateRequest)(editTaskSchema);
exports.validateDeleteTask = (0, validate_1.validateRequest)(deleteTaskSchema);
exports.validateDragTask = (0, validate_1.validateRequest)(dragTaskSchema);
exports.validateSetSubtask = (0, validate_1.validateRequest)(setSubtaskSchema);
exports.validateSetComment = (0, validate_1.validateRequest)(setCommentSchema);
exports.validateAssignUserToTask = (0, validate_1.validateRequest)(assignUserToTaskSchema);
const createTask = async (req, res, next) => {
    try {
        const { projId, listId, taskInfo } = createTaskSchema.parse(req.body);
        const project = await (0, project_1.findProjectById)(projId);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const taskId = (0, nanoid_1.nanoid)();
        const task = await (0, project_1.createTask)(projId, {
            id: taskId,
            name: taskInfo.name || 'Unnamed Task',
            points: taskInfo.points || 0,
            workedOnMs: 0,
            color: taskInfo.color || '#FFFFFF',
            dueDate: taskInfo.dueDate
                ? new Date(taskInfo.dueDate).toISOString()
                : null,
            description: taskInfo.description || null
        });
        if (taskInfo.subTasks && taskInfo.subTasks.length > 0) {
            const subtaskPromises = taskInfo.subTasks.map((subT, index) => db_1.db
                .insertInto('subtasks')
                .values({
                id: subT.id || (0, nanoid_1.nanoid)(),
                taskId: task.id,
                name: subT.name,
                completed: subT.completed ? 1 : 0,
                orderIndex: index
            })
                .execute());
            await Promise.all(subtaskPromises);
        }
        await (0, taskPositions_1.addTaskToColumn)(task.id, listId, 0); // Add to "todo" column by default
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        const newTask = updatedProject.tasks.find((t) => t.id === taskId);
        res.json({ project: updatedProject, task: newTask });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const editTask = async (req, res, next) => {
    try {
        const { projId, taskId, task } = editTaskSchema.parse(req.body);
        const updatedTask = await (0, project_1.updateTask)(taskId, task);
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        res.json({ project: updatedProject, task: updatedTask });
    }
    catch (error) {
        next(error);
    }
};
exports.editTask = editTask;
const deleteTask = async (req, res, next) => {
    try {
        const { projId, id } = deleteTaskSchema.parse(req.body);
        await db_1.db.deleteFrom('tasks').where('id', '=', id).execute(); // Cascade delete will handle related data
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        res.json({ project: updatedProject, task: null });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const dragTask = async (req, res, next) => {
    try {
        const { projectId, taskId, toListId, toProgress, toIdx } = dragTaskSchema.parse(req.body);
        await (0, taskPositions_1.moveTaskToPosition)(taskId, toListId, toProgress, toIdx);
        const updatedProject = await (0, toApi_1.getFullProject)(projectId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        res.json({ project: updatedProject });
    }
    catch (error) {
        next(error);
    }
};
exports.dragTask = dragTask;
const replaceListIds = async (req, res) => {
    // This function updates task positions based on list changes
    const { lists, projectId } = req.body;
    if (lists && projectId) {
        // Update task positions based on the new list structure
        await (0, taskPositions_1.updateTaskPositions)(lists);
        const updatedProject = await (0, toApi_1.getFullProject)(projectId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        res.json({ project: updatedProject });
    }
    else {
        res.status(400).json({ error: 'Missing lists or projectId' });
    }
};
exports.replaceListIds = replaceListIds;
const setSubtask = async (req, res, next) => {
    try {
        const { projId, taskId, subtaskId, info } = setSubtaskSchema.parse(req.body);
        const existingSubtask = await db_1.db
            .selectFrom('subtasks')
            .selectAll()
            .where('id', '=', subtaskId)
            .executeTakeFirst();
        if (info) {
            if (existingSubtask) {
                await db_1.db
                    .updateTable('subtasks')
                    .set({
                    name: info.name,
                    completed: info.completed ? 1 : 0
                })
                    .where('id', '=', subtaskId)
                    .execute();
            }
            else {
                await db_1.db
                    .insertInto('subtasks')
                    .values({
                    id: subtaskId,
                    name: info.name || 'New subtask',
                    completed: info.completed ? 1 : 0,
                    taskId: taskId,
                    orderIndex: info.orderIndex || 0
                })
                    .execute();
            }
        }
        else {
            await db_1.db.deleteFrom('subtasks').where('id', '=', subtaskId).execute();
        }
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        const updatedTask = updatedProject.tasks.find((t) => t.id === taskId);
        res.json({ project: updatedProject, task: updatedTask });
    }
    catch (error) {
        next(error);
    }
};
exports.setSubtask = setSubtask;
const setComment = async (req, res, next) => {
    try {
        const { projId, taskId, commentId, description } = setCommentSchema.parse(req.body);
        // Upsert comment
        await db_1.db
            .insertInto('comments')
            .values({
            id: commentId,
            taskId,
            comment: description,
            lastEdited: new Date().toISOString()
        })
            .onConflict((oc) => oc.column('id').doUpdateSet({
            comment: description,
            lastEdited: new Date().toISOString()
        }))
            .execute();
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        const updatedTask = updatedProject.tasks.find((t) => t.id === taskId);
        res.json({ project: updatedProject, task: updatedTask });
    }
    catch (error) {
        next(error);
    }
};
exports.setComment = setComment;
const assignUserToTask = async (req, res, next) => {
    try {
        const { projId, taskId, userId } = assignUserToTaskSchema.parse(req.body);
        // Check if assignment already exists
        const existing = await db_1.db
            .selectFrom('taskAssignments')
            .where('taskId', '=', taskId)
            .where('userId', '=', userId)
            .select('id')
            .executeTakeFirst();
        if (!existing) {
            await db_1.db
                .insertInto('taskAssignments')
                .values({ taskId, userId })
                .execute();
        }
        // Note: No functionality to un-assign in this endpoint
        const updatedProject = await (0, toApi_1.getFullProject)(projId);
        if (!updatedProject) {
            res.status(404).json({ error: 'Project not found after update' });
            return;
        }
        const updatedTask = updatedProject.tasks.find((t) => t.id === taskId);
        res.json({ project: updatedProject, task: updatedTask });
    }
    catch (error) {
        next(error);
    }
};
exports.assignUserToTask = assignUserToTask;
//# sourceMappingURL=task.js.map