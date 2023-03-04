"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/* eslint-disable import/first */
const express_1 = require("express");
exports.router = (0, express_1.Router)();
/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */
require("./auth");
require("./column");
require("./list");
require("./project");
require("./task");
//# sourceMappingURL=router.js.map