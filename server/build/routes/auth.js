"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.guestLogin = exports.logout = exports.register = exports.login = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const data_1 = require("../data");
const Chat_1 = require("../models/Chat");
const login = async (req, res, next) => {
    try {
        const projects = await Project_1.ProjectModel.find({
            id: req.user.projects
        }).lean();
        res.json({
            user: Object.assign(Object.assign({}, req.user.toObject()), { password: undefined, _id: undefined, projects: projects })
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const SALT_LENGTH = 10;
const register = async (req, res) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(SALT_LENGTH);
        const password = await bcryptjs_1.default.hash(req.body.password, salt);
        const [projectId, userId, chatId] = (0, data_1.generateIds)(3);
        const [project, newUser] = await Promise.all([
            Project_1.ProjectModel.create((0, data_1.generateDefaultProject)({
                id: userId,
                email: req.body.email,
                username: req.body.username,
                profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
            }, projectId, [chatId, 'General'])),
            await User_1.UserModel.create(Object.assign(Object.assign({}, (0, data_1.generateGuestUser)(projectId, userId)), { password, email: req.body.email, username: req.body.username })),
            await Chat_1.ChatModel.create({
                id: chatId,
                messages: [],
                projectId: projectId
            })
        ]);
        req.login(newUser, { session: req.body.persist }, (err) => {
            if (err) {
                console.log('could not passport login during signup', err);
            }
        });
        res.json({
            user: Object.assign(Object.assign({}, newUser.toObject()), { password: undefined, _id: undefined, projects: [project.toObject()] })
        });
    }
    catch (err) {
        throw new Error('Could not register, is that email address already in use?');
    }
};
exports.register = register;
const logout = async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.status(400).send('unable to log out');
            }
            res.redirect('/');
        });
    }
    else {
        res.end();
    }
};
exports.logout = logout;
const guestLogin = async (req, res) => {
    try {
        const [projectId, userId, chatId] = (0, data_1.generateIds)(3);
        const [project, user] = await Promise.all([
            Project_1.ProjectModel.create((0, data_1.generateDefaultProject)({
                email: 'No Email Registered',
                username: 'Guest',
                id: userId,
                profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
            }, projectId, [chatId, 'General'])),
            await User_1.UserModel.create((0, data_1.generateGuestUser)(projectId, userId)),
            await Chat_1.ChatModel.create({
                id: chatId,
                messages: []
            })
        ]);
        req.login(user, { session: true }, (err) => {
            if (err) {
                console.log('could not passport login during signup', err);
            }
        });
        res.json({
            user: Object.assign(Object.assign({}, user.toObject()), { projects: [project.toObject()] })
        });
    }
    catch (err) {
        throw new Error('Could not create guest, sorry!');
    }
};
exports.guestLogin = guestLogin;
const deleteAccount = async (req, res) => {
    await User_1.UserModel.deleteOne({ id: req.user.id });
    res.status(200);
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=auth.js.map