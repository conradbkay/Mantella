"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = exports.Project = void 0;
const tslib_1 = require("tslib");
const typegoose_1 = require("@typegoose/typegoose");
let Project = class Project {
};
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Project.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Project.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Project.prototype, "ownerId", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], Project.prototype, "lists", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], Project.prototype, "history", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], Project.prototype, "users", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Object)
], Project.prototype, "security", void 0);
Project = tslib_1.__decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: 0 } })
], Project);
exports.Project = Project;
exports.ProjectModel = (0, typegoose_1.getModelForClass)(Project);
//# sourceMappingURL=Project.js.map