"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = exports.serializeUser = exports.passportStrategy = exports.isAuthenticated = void 0;
const user_1 = require("./db/user");
const isAuthenticated = (req, res, next) => {
    if (req.user)
        return next();
    else
        return res.status(401).json({
            error: 'User not authenticated'
        });
};
exports.isAuthenticated = isAuthenticated;
const passportStrategy = async (req, email, password, done) => {
    try {
        const user = await (0, user_1.findUserByEmail)(email);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const matches = await (0, user_1.comparePassword)(password, user.password);
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
        const user = await (0, user_1.findUserById)(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
};
exports.deserializeUser = deserializeUser;
//# sourceMappingURL=passport.js.map