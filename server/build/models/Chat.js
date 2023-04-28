"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = exports.Chat = void 0;
const tslib_1 = require("tslib");
const typegoose_1 = require("@typegoose/typegoose");
let Chat = class Chat {
};
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", Array)
], Chat.prototype, "messages", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Chat.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Chat.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typegoose_1.prop)(),
    tslib_1.__metadata("design:type", String)
], Chat.prototype, "projectId", void 0);
Chat = tslib_1.__decorate([
    (0, typegoose_1.modelOptions)({ options: { allowMixed: 0 } })
], Chat);
exports.Chat = Chat;
exports.ChatModel = (0, typegoose_1.getModelForClass)(Chat);
//# sourceMappingURL=Chat.js.map