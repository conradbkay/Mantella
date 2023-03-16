"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createList = exports.deleteList = exports.editList = void 0;
const Project_1 = require("../models/Project");
const uuid_1 = require("uuid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const editList = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        const list = project.lists.find((l) => {
            return l.id === req.body.listId;
        });
        list.name = req.body.newList.name || list.name;
        list.taskIds = req.body.newList.taskIds || list.taskIds;
        const newProj = await project.save();
        const pure = newProj.toObject();
        res.json({
            project: pure,
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
        ;
        project.lists.find((l) => l.id === req.body.id).remove();
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
    const newId = (0, uuid_1.v4)();
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        project.lists.push({
            id: newId,
            name: req.body.name || 'new list',
            taskIds: [[], [], []]
        });
        const newProj = await project.save();
        const pure = newProj.toObject();
        res.json({
            project: pure,
            list: pure.lists.find((l) => l.id === newId)
        });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.createList = createList;
router_1.router.post('/createList', passport_1.isAuthenticated, exports.createList);
//# sourceMappingURL=list.js.map