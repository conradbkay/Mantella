"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const tslib_1 = require("tslib");
/* eslint-disable import/first */
const express_1 = require("express");
const auth_1 = require("./auth");
const passport_1 = require("../passport");
const passport_2 = tslib_1.__importDefault(require("passport"));
exports.router = (0, express_1.Router)();
/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */
exports.router.post('/logout', auth_1.logout);
exports.router.post('/register', auth_1.register);
// doesn't work without {session: true}
exports.router.post('/login', passport_2.default.authenticate('local', { session: true }), auth_1.login);
exports.router.post('/cookieLogin', passport_1.isAuthenticated, auth_1.login);
exports.router.post('/guestLogin', auth_1.guestLogin);
require("./list");
require("./project");
require("./chat");
require("./task");
require("./user");
//# sourceMappingURL=router.js.map