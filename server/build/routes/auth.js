"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.guestLogin = exports.logout = exports.register = exports.login = exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
const project_1 = require("../db/project");
const user_1 = require("../db/user");
const toApi_1 = require("../db/toApi");
const validate_1 = require("../middleware/validate");
const nanoid_1 = require("nanoid");
// Zod validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    username: zod_1.z.string().min(1, 'Username is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    persist: zod_1.z.boolean()
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
    persist: zod_1.z.boolean()
});
exports.validateRegister = (0, validate_1.validateRequest)(registerSchema);
exports.validateLogin = (0, validate_1.validateRequest)(loginSchema);
const login = async (req, res, next) => {
    try {
        const user = req.user;
        const projects = await (0, project_1.findProjectsByUserId)(user.id);
        const fullProjects = await Promise.all(projects.map((p) => (0, toApi_1.getFullProject)(p.id)));
        res.json({
            user: {
                ...user,
                password: undefined,
                projects: fullProjects
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
// Helper function to create user with default project and handle login
async function createUserWithDefaultProject(userData, loginOptions, req, res, next) {
    try {
        const newUser = await (0, user_1.createUser)(userData);
        const project = await (0, project_1.createProjectWithDefaults)({
            name: 'Tutorial Project',
            ownerId: newUser.id,
            colors: [],
            securityPublic: true
        }, {
            id: newUser.id,
            email: userData.email,
            username: userData.username,
            profileImg: userData.profileImg
        });
        req.login(newUser, { session: loginOptions.persist }, (err) => {
            if (err) {
                console.log('could not passport login during signup', err);
                return next(err);
            }
            res.json({
                user: {
                    ...newUser,
                    password: undefined,
                    projects: [project]
                }
            });
        });
    }
    catch (err) {
        next(err);
    }
}
const register = async (req, res, next) => {
    try {
        const { email, username, password, persist } = registerSchema.parse(req.body);
        await createUserWithDefaultProject({
            username,
            email,
            password,
            profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
        }, { persist }, req, res, next);
    }
    catch (err) {
        next(err);
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
const guestLogin = async (req, res, next) => {
    try {
        const guestEmail = `guest_${(0, nanoid_1.nanoid)(8)}@example.com`;
        await createUserWithDefaultProject({
            username: 'Guest',
            email: guestEmail,
            profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
        }, { persist: true }, req, res, next);
    }
    catch (err) {
        next(err);
    }
};
exports.guestLogin = guestLogin;
const deleteAccount = async (req, res) => {
    await (0, user_1.deleteUser)(req.user.id);
    res.status(200);
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=auth.js.map