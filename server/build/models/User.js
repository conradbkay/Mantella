"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.comparePassword = exports.getUserById = exports.getUserByEmail = exports.User = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const typegoose_1 = require("@typegoose/typegoose");
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "username", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "profileImg", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "guest", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
exports.User = User = tslib_1.__decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: 0 } })
], User);
const getUserByEmail = async (email) => {
    return await exports.UserModel.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    return await exports.UserModel.findOne({ id: id });
};
exports.getUserById = getUserById;
const comparePassword = async (candidatePassword, hash) => {
    return await bcryptjs_1.default.compare(candidatePassword, hash);
};
exports.comparePassword = comparePassword;
exports.UserModel = (0, typegoose_1.getModelForClass)(User);
//# sourceMappingURL=User.js.map