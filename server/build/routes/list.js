"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setListIdx = exports.createList = exports.deleteList = exports.editList = void 0;
const Project_1 = require("../models/Project");
const nanoid_1 = require("nanoid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const userResolver_1 = require("../utils/userResolver");
const editList = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        const list = project.lists.find((l) => {
            return l.id === req.body.listId;
        });
        list.name = req.body.newList.name || list.name;
        list.taskIds = req.body.newList.taskIds || list.taskIds;
        const newProj = await project.save();
        const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(newProj.toObject());
        res.json({
            project: resolvedProject,
            list: newProj.lists.find((l) => l.id === req.body.listId)
        });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.editList = editList;
router_1.router.post('/editList', passport_1.isAuthenticated, exports.editList);
const deleteList = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project && project.lists.length > 1) {
        project.lists = project.lists.filter((list) => list.id !== req.body.id);
        project.markModified('lists');
        await project.save();
        res.json({ id: req.body.id });
    }
    else {
        throw new Error('cant delete final list!');
    }
};
exports.deleteList = deleteList;
router_1.router.post('/deleteList', passport_1.isAuthenticated, exports.deleteList);
const createList = async (req, res) => {
    const newId = (0, nanoid_1.nanoid)();
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        project.lists.push({
            id: newId,
            name: req.body.name || 'New List',
            taskIds: [[], [], []]
        });
        const newProj = await project.save();
        const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(newProj.toObject());
        res.json({
            project: resolvedProject,
            list: resolvedProject.lists.find((l) => l.id === newId)
        });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.createList = createList;
router_1.router.post('/createList', passport_1.isAuthenticated, exports.createList);
const setListIdx = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        const list = project.lists.find((l) => l.id === req.body.id);
        const idx = project.lists.indexOf(list);
        const element = project.lists.splice(idx, 1)[0];
        project.lists.splice(idx + req.body.offset, 0, element);
        project.markModified('lists');
        await project.save();
        res.json({ id: req.body.id });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.setListIdx = setListIdx;
router_1.router.post('/setListIdx', passport_1.isAuthenticated, exports.setListIdx);
//# sourceMappingURL=list.js.map