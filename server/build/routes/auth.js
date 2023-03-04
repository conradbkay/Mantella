"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestLogin = exports.logout = exports.register = exports.login = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const data_1 = require("../data");
const router_1 = require("./router");
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_2 = require("../passport");
const login = async (req, res, next) => {
    try {
        const [user, projects] = await Promise.all([
            User_1.UserModel.findOne({
                email: req.user ? req.user.email : 'undefined'
            }).lean(),
            Project_1.ProjectModel.find({
                id: req.user ? req.user.projects : 'undefined'
            }).lean()
        ]);
        res.json({
            user: Object.assign(Object.assign({}, user), { projects: projects })
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
// doesn't work without {session: true}
router_1.router.post('/login', passport_1.default.authenticate('local', { session: true }), exports.login);
router_1.router.post('/cookieLogin', passport_2.isAuthenticated, exports.login);
const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4;
const register = async (req, res) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(SALT_LENGTH);
        const password = await bcryptjs_1.default.hash(req.body.password, salt);
        const [projectId, userId] = (0, data_1.generateIds)(2);
        const [project, newUser] = await Promise.all([
            Project_1.ProjectModel.create((0, data_1.generateDefaultProject)({
                id: userId,
                email: req.body.email,
                username: req.body.username,
                profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
            }, projectId)),
            await User_1.UserModel.create(Object.assign(Object.assign({}, (0, data_1.generateGuestUser)(projectId, userId)), { password, email: req.body.email, username: req.body.username }))
        ]);
        res.json({
            user: Object.assign(Object.assign({}, newUser.toObject()), { projects: [project.toObject()] })
        });
    }
    catch (err) {
        console.log(err);
        throw new Error('Could not register, is that email address already in use?');
    }
};
exports.register = register;
// todo: make session persist
router_1.router.post('/register', exports.register);
const logout = async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.status(400).send('unable to log out');
            }
            res.send('logged out');
        });
    }
    else {
        res.end();
    }
};
exports.logout = logout;
router_1.router.post('/logout', exports.logout);
const guestLogin = async (req, res) => {
    try {
        const [projectId, userId] = (0, data_1.generateIds)(2);
        const [project, user] = await Promise.all([
            Project_1.ProjectModel.create((0, data_1.generateDefaultProject)({
                email: 'No Email Registered',
                username: 'Guest',
                id: userId,
                profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
            }, projectId)),
            await User_1.UserModel.create((0, data_1.generateGuestUser)(projectId, userId))
        ]);
        res.json({
            user: Object.assign(Object.assign({}, user.toObject()), { projects: [project.toObject()] })
        });
    }
    catch (err) {
        throw new Error('Could not create guest, sorry!');
    }
};
exports.guestLogin = guestLogin;
router_1.router.post('/guestLogin', exports.guestLogin);
//# sourceMappingURL=auth.js.map