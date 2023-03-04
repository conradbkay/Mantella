"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = exports.serializeUser = exports.passportStrategy = exports.isAuthenticated = void 0;
const User_1 = require("./models/User");
const isAuthenticated = (req, res, next) => {
    if (req.user)
        return next();
    else
        return res.status(401).json({
            error: 'User not authenticated'
        });
};
exports.isAuthenticated = isAuthenticated;
const passportStrategy = async (email, password, done) => {
    try {
        const user = await User_1.UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const matches = await (0, User_1.comparePassword)(password, user.password);
        if (!matches) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
};
exports.passportStrategy = passportStrategy;
const serializeUser = (user, done) => {
    done(null, user.id);
};
exports.serializeUser = serializeUser;
const deserializeUser = async (id, done) => {
    try {
        const user = await User_1.UserModel.findOne({ id });
        done(null, user === null || user === void 0 ? void 0 : user.toObject());
    }
    catch (err) {
        done(err);
    }
};
exports.deserializeUser = deserializeUser;
//# sourceMappingURL=passport.js.map