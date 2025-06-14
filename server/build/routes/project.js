"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveRole = exports.setUserRoles = exports.setRole = exports.getProjectMembers = exports.shareProject = exports.getProjectById = exports.kickUserFromProject = exports.leaveProject = exports.deleteProject = exports.editProject = exports.createProject = void 0;
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const nanoid_1 = require("nanoid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const Chat_1 = require("../models/Chat");
const data_1 = require("../data");
const userResolver_1 = require("../utils/userResolver");
const createProject = async (req, res) => {
    const creatingId = (0, nanoid_1.nanoid)();
    const listId = (0, nanoid_1.nanoid)();
    const chatId = (0, nanoid_1.nanoid)();
    const adminRoleId = (0, nanoid_1.nanoid)();
    if (req.user) {
        ;
        req.user.projects.push(creatingId);
        const [created] = await Promise.all([
            Project_1.ProjectModel.create({
                colors: data_1.defaultColors,
                privacy: {
                    public: req.body.public || false
                },
                roles: [
                    {
                        name: 'Admin',
                        color: '#FF0000',
                        id: adminRoleId
                    }
                ],
                id: creatingId,
                name: req.body.name,
                ownerId: req.user.id,
                users: [
                    {
                        id: req.user.id,
                        roles: [adminRoleId]
                    }
                ],
                lists: [
                    {
                        id: listId,
                        name: 'Generic',
                        taskIds: [[], [], []]
                    }
                ],
                tasks: [],
                channels: [[chatId, 'General']],
                enrolledUsers: [],
                columnOrder: [listId],
                isPrivate: false
            }),
            req.user.save(),
            Chat_1.ChatModel.create({ id: chatId, messages: [], projectId: creatingId })
        ]);
        // Resolve users before returning
        const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(created.toObject());
        res.json({ project: resolvedProject });
    }
    else {
        throw new Error('user id not provided in token');
    }
};
exports.createProject = createProject;
router_1.router.post('/createProject', passport_1.isAuthenticated, exports.createProject);
const editProject = async (req, res) => {
    if (req.body.id) {
        const project = await Project_1.ProjectModel.findOne({ id: req.body.id });
        if (project) {
            project.name = req.body.newProj.name
                ? req.body.newProj.name
                : project.name;
            project.colors = req.body.newProj.colors
                ? req.body.newProj.colors
                : project.colors;
            const newProj = await project.save();
            if (newProj) {
                const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(newProj.toObject());
                res.json({ project: resolvedProject });
            }
        }
    }
    else {
        throw new Error('not signed in');
    }
};
exports.editProject = editProject;
router_1.router.post('/editProject', passport_1.isAuthenticated, exports.editProject);
const deleteProject = async (req, res) => {
    const users = await User_1.UserModel.find({ projects: req.body.id });
    if (users) {
        for (const user of users) {
            user.projects = user.projects.filter((proj) => proj !== req.body.id);
            await user.save();
        }
    }
    const deleted = await Project_1.ProjectModel.findOneAndDelete({ id: req.body.id });
    if (deleted) {
        res.json({
            id: deleted.id
        });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.deleteProject = deleteProject;
router_1.router.post('/deleteProject', passport_1.isAuthenticated, exports.deleteProject);
const leaveProject = async (req, res) => {
    const id = req.user.id;
    if (id) {
        const project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
        if (!project) {
            throw new Error('Project does not exist');
        }
        const user = await User_1.UserModel.findOneAndUpdate({ id: id }, {
            $pull: {
                projects: project.id
            }
        });
        if (user) {
            res.json({ project: project.toObject() });
        }
        else {
            throw new Error('could not join project');
        }
    }
    else {
        throw new Error('User not signed in');
    }
};
exports.leaveProject = leaveProject;
router_1.router.post('/leaveProject', passport_1.isAuthenticated, exports.leaveProject);
const kickUserFromProject = async (req, res) => {
    const id = req.body.userId;
    if (id) {
        let project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
        if (!project) {
            throw new Error('Project does not exist');
        }
        if (project.ownerId !== req.user.id) {
            throw new Error('You cannot kick members from this project');
        }
        const kicking = await User_1.UserModel.findOne({ id });
        if (!kicking) {
            throw new Error('User does not exist');
        }
        kicking.projects = kicking.projects.filter((proj) => proj !== project.id);
        project.users.splice(project.users.findIndex((user) => user.id === id), 1);
        let modifiedTasks = false;
        for (let i = 0; i < project.tasks.length; i++) {
            if (project.tasks[i].assignedTo.includes(id)) {
                project.tasks[i].assignedTo.splice(project.tasks[i].assignedTo.indexOf(id), 1);
                modifiedTasks = true;
            }
        }
        if (modifiedTasks) {
            project.markModified('tasks');
        }
        project.markModified('users');
        project = await project.save();
        kicking.markModified('projects');
        await kicking.save();
        const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(project.toObject());
        res.json({ project: resolvedProject });
    }
    else {
        throw new Error('User not signed in');
    }
};
exports.kickUserFromProject = kickUserFromProject;
router_1.router.post('/kickUser', passport_1.isAuthenticated, exports.kickUserFromProject);
const getProjectById = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.id });
    if (proj) {
        const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(proj.toObject());
        res.json({ project: resolvedProject });
    }
    else {
        throw new Error('proj not found');
    }
};
exports.getProjectById = getProjectById;
router_1.router.get('/getProjectById', passport_1.isAuthenticated, exports.getProjectById);
const shareProject = async (req, res) => {
    let user = await User_1.UserModel.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ message: 'User could not be found' });
        return;
    }
    if (user.projects.includes(req.body.projectId)) {
        res.status(400).json({ message: 'User already in project' });
        return;
    }
    let project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (!project) {
        throw new Error('project does not exist');
    }
    project.users.push({
        id: user.id,
        roles: []
    });
    project.markModified('users');
    project = await project.save();
    user.projects.push(req.body.projectId);
    await user.save();
    // Resolve users before returning
    const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(project.toObject());
    res.status(200).json({ message: 'Success', project: resolvedProject });
};
exports.shareProject = shareProject;
router_1.router.post('/shareProject', passport_1.isAuthenticated, exports.shareProject);
const getProjectMembers = async (req, res) => {
    let users = await User_1.UserModel.find({ projects: { $in: [req.body.projectId] } });
    res.json({ users });
};
exports.getProjectMembers = getProjectMembers;
router_1.router.post('/getProjectMembers', passport_1.isAuthenticated, exports.getProjectMembers);
const setRole = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (!project) {
        throw new Error('project does not exist');
    }
    const role = req.body.role;
    const roleIdx = project.roles.findIndex((compare) => {
        return typeof role === 'string'
            ? compare.id === role
            : compare.id === role.id;
    });
    if (roleIdx === -1) {
        project.roles.push(role);
    }
    else if (typeof role === 'string') {
        project.roles.splice(roleIdx, 1);
    }
    else {
        project.roles[roleIdx] = role;
    }
    project.markModified('roles');
    const savedProject = await project.save();
    const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(savedProject.toObject());
    res.json({ project: resolvedProject });
};
exports.setRole = setRole;
router_1.router.post('/setRole', passport_1.isAuthenticated, exports.setRole);
const setUserRoles = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (!project) {
        throw new Error('project does not exist');
    }
    const userIdx = project.users.findIndex((compare) => {
        return compare.id === req.body.userId;
    });
    project.users[userIdx].roles = req.body.roles;
    project.markModified('users');
    const savedProject = await project.save();
    const resolvedProject = await (0, userResolver_1.resolveProjectUsers)(savedProject.toObject());
    res.json({ project: resolvedProject });
};
exports.setUserRoles = setUserRoles;
router_1.router.post('/setUserRoles', passport_1.isAuthenticated, exports.setUserRoles);
const moveRole = async (req, res) => {
    const project = await Project_1.ProjectModel.findOne({ id: req.body.projectId });
    if (!project) {
        throw new Error('project does not exist');
    }
    project.roles.splice(req.body.to, 0, project.roles.splice(req.body.from, 1)[0]);
    project.markModified('roles');
    await project.save();
    res.json({ message: 'done' });
};
exports.moveRole = moveRole;
router_1.router.post('/moveRole', passport_1.isAuthenticated, exports.moveRole);
//# sourceMappingURL=project.js.map