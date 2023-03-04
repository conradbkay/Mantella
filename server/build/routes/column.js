"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColumn = exports.toggleCollapsed = exports.createColumn = void 0;
const User_1 = require("../models/User");
const uuid_1 = require("uuid");
const Project_1 = require("../models/Project");
const router_1 = require("./router");
const passport_1 = require("../passport");
const createColumn = async (req, res) => {
    const creatingId = (0, uuid_1.v4)();
    const [user, project] = await Promise.all([
        User_1.UserModel.findOne({ id: req.user.id }),
        Project_1.ProjectModel.findOne({ id: req.body.projId })
    ]);
    if (!user || !project) {
        throw new Error('Error creating column');
    }
    project.columns.push({
        inProgress: false,
        id: creatingId,
        name: req.body.name,
        collapsedUsers: [],
        taskIds: []
    });
    const newProject = await project.save();
    res.json({
        project: newProject,
        column: newProject.columns.find((col) => col.id === creatingId)
    });
};
exports.createColumn = createColumn;
router_1.router.post('/createColumn', passport_1.isAuthenticated, exports.createColumn);
const toggleCollapsed = async (req, res) => {
    const [user, project] = await Promise.all([
        User_1.UserModel.findOne({ id: req.user.id }),
        await Project_1.ProjectModel.findOne({ id: req.body.projId })
    ]);
    if (user && project) {
        const col = project.columns.find((col) => col.id === req.body.colId);
        if (col) {
            const userIdInCollapsed = col.collapsedUsers.indexOf(req.user.id);
            if (userIdInCollapsed > -1) {
                // user has column collapsed
                col.collapsedUsers.splice(userIdInCollapsed, 1);
            }
            else {
                col.collapsedUsers = [...col.collapsedUsers, req.user.id];
            }
            const newProj = await project.save();
            res.json({ column: col, project: newProj });
        }
        throw new Error('column does not exist');
    }
    else {
        throw new Error('user id not provided');
    }
};
exports.toggleCollapsed = toggleCollapsed;
router_1.router.post('/toggleCollapsed', passport_1.isAuthenticated, exports.toggleCollapsed);
const deleteColumn = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (project) {
        if (project.columns.length <= 1) {
            throw new Error('trying to delete last column');
        }
        if (project.columns.find((col) => col.id === req.body.colId).inProgress) {
            throw new Error('Trying to delete in progress column');
        }
        project.columns = project.columns.filter((col) => col.id !== req.body.colId);
        await project.save();
        res.json({ id: req.body.colId });
    }
    else {
        throw new Error('project no longer exists');
    }
};
exports.deleteColumn = deleteColumn;
router_1.router.post('/deleteColumn', passport_1.isAuthenticated, exports.deleteColumn);
//# sourceMappingURL=column.js.map