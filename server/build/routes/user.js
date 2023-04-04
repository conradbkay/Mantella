"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setName = exports.setEmail = void 0;
const router_1 = require("./router");
const passport_1 = require("../passport");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
// TODO: we could return the updated project, but they can just refresh
const setEmail = async (req, res) => {
    const user = req.user;
    const withEmail = await User_1.UserModel.findOne({ email: req.body.email });
    if (withEmail) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }
    user.email = req.body.email;
    const projects = await Project_1.ProjectModel.find({
        users: { $elemMatch: { id: user.id } }
    });
    for (let project of projects) {
        const idx = project.users.findIndex((u) => u.id === user.id);
        project.users[idx].email = req.body.email;
        project.markModified('users');
        project.save();
    }
    await user.save();
    res.json({ email: req.body.email });
};
exports.setEmail = setEmail;
const setName = async (req, res) => {
    const user = req.user;
    user.username = req.body.username;
    const projects = await Project_1.ProjectModel.find({
        users: { $elemMatch: { id: user.id } }
    });
    for (let project of projects) {
        const idx = project.users.findIndex((u) => u.id === user.id);
        project.users[idx].username = req.body.username;
        project.markModified('users');
        project.save();
    }
    await user.save();
    res.json({ name: user.username });
};
exports.setName = setName;
router_1.router.post('/setEmail', passport_1.isAuthenticated, exports.setEmail);
router_1.router.post('/setName', passport_1.isAuthenticated, exports.setName);
//# sourceMappingURL=user.js.map