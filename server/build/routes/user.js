"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.setName = exports.setEmail = void 0;
const tslib_1 = require("tslib");
const router_1 = require("./router");
const passport_1 = require("../passport");
const User_1 = require("../models/User");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
// User information is now resolved dynamically, so we only need to update the User model
const setEmail = async (req, res) => {
    const user = req.user;
    const withEmail = await User_1.UserModel.findOne({ email: req.body.email });
    if (withEmail) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }
    user.email = req.body.email;
    await user.save();
    res.json({ email: req.body.email });
};
exports.setEmail = setEmail;
const setName = async (req, res) => {
    const user = req.user;
    user.username = req.body.username;
    await user.save();
    res.json({ name: user.username });
};
exports.setName = setName;
const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4;
const setPassword = async (req, res) => {
    const user = req.user;
    const salt = await bcryptjs_1.default.genSalt(SALT_LENGTH);
    const password = await bcryptjs_1.default.hash(req.body.password, salt);
    user.password = password;
    user.guest = false;
    await user.save();
    res.json({ user });
};
exports.setPassword = setPassword;
router_1.router.post('/setEmail', passport_1.isAuthenticated, exports.setEmail);
router_1.router.post('/setName', passport_1.isAuthenticated, exports.setName);
router_1.router.post('/setPassword', passport_1.isAuthenticated, exports.setPassword);
//# sourceMappingURL=user.js.map