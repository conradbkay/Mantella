"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPassword = exports.setName = exports.setEmail = void 0;
const tslib_1 = require("tslib");
const user_1 = require("../db/user");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const setEmail = async (req, res) => {
    const user = req.user;
    const withEmail = await (0, user_1.findUserByEmail)(req.body.email);
    if (withEmail) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }
    await (0, user_1.updateUser)(user.id, { email: req.body.email });
    res.json({ email: req.body.email });
};
exports.setEmail = setEmail;
const setName = async (req, res) => {
    const user = req.user;
    await (0, user_1.updateUser)(user.id, { username: req.body.username });
    res.json({ name: req.body.username });
};
exports.setName = setName;
const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4;
const setPassword = async (req, res) => {
    const user = req.user;
    const hashedPassword = await bcryptjs_1.default.hash(req.body.password, SALT_LENGTH);
    await (0, user_1.updateUser)(user.id, { password: hashedPassword });
    res.json({ message: 'Password updated' });
};
exports.setPassword = setPassword;
//# sourceMappingURL=user.js.map