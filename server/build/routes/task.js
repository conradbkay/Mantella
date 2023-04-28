"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUserToTask = exports.setComment = exports.setSubtask = exports.replaceListIds = exports.dragTask = exports.deleteTask = exports.editTask = exports.createTask = void 0;
const Project_1 = require("../models/Project");
const uuid_1 = require("uuid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const createTask = async (req, res) => {
    const taskId = (0, uuid_1.v4)();
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        proj.tasks.push({
            createdAt: new Date().toString(),
            id: taskId,
            name: req.body.taskInfo.name || 'Unnamed Task',
            points: req.body.taskInfo.points || 0,
            timeWorkedOn: 0,
            color: req.body.taskInfo.color || '#FFFFFF',
            dueDate: req.body.taskInfo.dueDate
                ? new Date(req.body.taskInfo.dueDate).toString()
                : undefined,
            subTasks: req.body.taskInfo.subTasks
                ? req.body.taskInfo.subTasks.map((subT) => (Object.assign(Object.assign({}, subT), { id: (0, uuid_1.v4)() })))
                : [],
            comments: [],
            description: req.body.taskInfo.description,
            assignedTo: []
        });
        const list = proj.lists.find((col) => col.id === req.body.listId);
        list.taskIds[0] = [...list.taskIds[0], taskId];
        proj.markModified('tasks');
        proj.markModified('lists');
        const newProj = await proj.save();
        const pure = newProj.toObject();
        if (pure) {
            const task = pure.tasks.find((tk) => taskId === tk.id);
            res.json({
                project: pure,
                task: task
            });
        }
    }
    else {
        throw new Error('proj id not exist');
    }
};
exports.createTask = createTask;
router_1.router.post('/createTask', passport_1.isAuthenticated, exports.createTask);
const editTask = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        const task = project.tasks.find((tsk) => tsk.id === req.body.taskId);
        task.name = req.body.task.name || task.name;
        task.points = req.body.task.points || task.points;
        task.dueDate = req.body.task.dueDate || task.dueDate;
        // task.recurrance = req.body.task.recurrance || task.recurrance
        task.color = req.body.task.color || task.color;
        task.description = req.body.task.description;
        project.markModified('tasks'); // mongo won't notice that tasks were modified without this since it's so nested
        const newProj = await project.save();
        const pure = await newProj.toObject();
        if (pure) {
            if (task) {
                res.json({
                    project: pure,
                    task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId)
                });
            }
            else {
                throw new Error('Task not created');
            }
        }
    }
    else {
        throw new Error('project not able to be updated');
    }
};
exports.editTask = editTask;
router_1.router.post('/editTask', passport_1.isAuthenticated, exports.editTask);
const deleteTask = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        proj.tasks = proj.tasks.filter((task) => task.id !== req.body.id);
        proj.lists.forEach((list) => {
            list.taskIds.forEach((ids, i) => {
                if (ids.includes(req.body.id)) {
                    list.taskIds[i].splice(ids.indexOf(req.body.id), 1);
                }
            });
        });
        proj.markModified('tasks');
        proj.markModified('lists');
        const newProj = await proj.save();
        res.json({ project: newProj.toObject(), task: null });
    }
    else {
        throw new Error('project not defined');
    }
};
exports.deleteTask = deleteTask;
router_1.router.post('/deleteTask', passport_1.isAuthenticated, exports.deleteTask);
const dragTask = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (proj) {
        const oldListIdx = proj.lists.findIndex((list) => list.id === req.body.from[0]);
        const newListIdx = proj.lists.findIndex((list) => list.id === req.body.to[0]);
        proj.lists[oldListIdx].taskIds[req.body.from[1]] = req.body.from[2];
        proj.lists[newListIdx].taskIds[req.body.to[1]] = req.body.to[2];
        proj.markModified('lists'); // mongoose does not watch subarrays this deep
        const newProj = await proj.save();
        res.json({ project: newProj.toObject() });
    }
    else {
        throw new Error('project not defined');
    }
};
exports.dragTask = dragTask;
router_1.router.post('/dragTask', passport_1.isAuthenticated, exports.dragTask);
const replaceListIds = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (proj) {
        for (let list of req.body.lists) {
            const listIdx = proj.lists.findIndex((l) => l.id === list.id);
            proj.lists[listIdx].taskIds = list.taskIds;
        }
        proj.markModified('lists'); // mongoose does not watch subarrays this deep
        await proj.save();
        res.json({ message: 'success' });
    }
    else {
        throw new Error('project not defined');
    }
};
exports.replaceListIds = replaceListIds;
router_1.router.post('/replaceListIds', passport_1.isAuthenticated, exports.replaceListIds);
const setSubtask = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        const task = proj.tasks.find((tsk) => tsk.id === req.body.taskId);
        const subTask = task.subTasks.find((subT) => subT.id === req.body.subtaskId);
        if (!subTask) {
            task.subTasks.push({
                completed: false,
                name: req.body.info.name || 'Subtask',
                id: req.body.subtaskId
            });
        }
        else if (!req.body.info) {
            task.subTasks = task.subTasks.filter((sub) => sub.id !== req.body.subtaskId);
        }
        else {
            subTask.completed =
                req.body.info.completed !== null &&
                    req.body.info.completed !== undefined
                    ? req.body.info.completed
                    : subTask.completed;
            subTask.name =
                req.body.info.name !== null && req.body.info.name !== undefined
                    ? req.body.info.name
                    : subTask.name;
        }
        const newProj = await proj.save();
        res.json({ task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId) });
    }
    else {
        throw new Error('project not defined');
    }
};
exports.setSubtask = setSubtask;
router_1.router.post('/setSubtask', passport_1.isAuthenticated, exports.setSubtask);
const setComment = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        const task = proj.tasks.find((tsk) => tsk.id === req.body.taskId);
        if (req.body.commentId) {
            const comment = task.comments.find((com) => com.id === req.body.commentId);
            if (!req.body.description) {
                ;
                comment.remove();
            }
            else {
                comment.comment = req.body.description;
            }
        }
        else {
            task.comments.push({
                dateAdded: new Date().toString(),
                comment: req.body.description || 'Comment',
                id: (0, uuid_1.v4)()
            });
        }
        const newProj = await proj.save();
        res.json({ task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId) });
    }
    else {
        throw new Error('project not defined');
    }
};
exports.setComment = setComment;
router_1.router.post('/setComment', passport_1.isAuthenticated, exports.setComment);
const assignUserToTask = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (!proj) {
        throw new Error('Project does not exist');
    }
    const task = proj.tasks.find((tsk) => tsk.id === req.body.taskId);
    if (!task) {
        throw new Error('task not in project');
    }
    if (task.assignedTo.includes(req.body.userId)) {
        task.assignedTo.splice(task.assignedTo.indexOf(req.body.userId), 1);
    }
    else {
        task.assignedTo.push(req.body.userId);
    }
    proj.markModified('tasks');
    const newProj = await proj.save();
    res.json({ task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId) });
};
exports.assignUserToTask = assignUserToTask;
router_1.router.post('/assignUserToTask', passport_1.isAuthenticated, exports.assignUserToTask);
//# sourceMappingURL=task.js.map