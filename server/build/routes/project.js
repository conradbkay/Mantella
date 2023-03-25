"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMembers = exports.shareProject = exports.getProjectById = exports.kickUserFromProject = exports.leaveProject = exports.deleteProject = exports.editProject = exports.createProject = void 0;
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const uuid_1 = require("uuid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const Chat_1 = require("../models/Chat");
const createProject = async (req, res) => {
    const creatingId = (0, uuid_1.v4)();
    const listId = (0, uuid_1.v4)();
    const chatId = (0, uuid_1.v4)();
    if (req.user) {
        ;
        req.user.projects.push(creatingId);
        const [created] = await Promise.all([
            Project_1.ProjectModel.create({
                id: creatingId,
                name: req.body.name,
                ownerId: req.user.id,
                users: [
                    {
                        id: req.user.id,
                        username: req.user.username,
                        email: req.user.email,
                        profileImg: req.user.profileImg
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
                chatId: chatId,
                enrolledUsers: [],
                columnOrder: [listId],
                isPrivate: false
            }),
            req.user.save(),
            Chat_1.ChatModel.create({ id: chatId, messages: [], projectId: creatingId })
        ]);
        res.json({ project: created.toObject() });
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
            const newProj = await project.save();
            if (newProj) {
                res.json({ project: newProj.toObject() });
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
            if (!user.projects.length) {
                throw new Error('cannot delete only project');
            }
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
        res.json({ project: project.toObject() });
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
        return proj.toObject();
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
        email: user.email,
        username: user.username,
        profileImg: user.profileImg || '',
        id: user.id
    });
    project.markModified('users');
    project = await project.save();
    user.projects.push(req.body.projectId);
    await user.save();
    res.status(200).json({ message: 'Success', project });
};
exports.shareProject = shareProject;
router_1.router.post('/shareProject', passport_1.isAuthenticated, exports.shareProject);
const getProjectMembers = async (req, res) => {
    let users = await User_1.UserModel.find({ projects: { $in: [req.body.projectId] } });
    res.json({ users });
};
exports.getProjectMembers = getProjectMembers;
router_1.router.post('/getProjectMembers', passport_1.isAuthenticated, exports.getProjectMembers);
//# sourceMappingURL=project.js.map