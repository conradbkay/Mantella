"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.createChat = void 0;
const Project_1 = require("../models/Project");
const uuid_1 = require("uuid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const Chat_1 = require("../models/Chat");
const createChat = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        const chatId = (0, uuid_1.v4)();
        const chat = await Chat_1.ChatModel.create({
            id: chatId,
            projectId: req.body.projId,
            messages: []
        });
        proj.chatId = chatId;
        await proj.save();
        res.json({ chat: chat.toObject() });
    }
    else {
        throw new Error('Project does not exist');
    }
};
exports.createChat = createChat;
router_1.router.post('/createChat', passport_1.isAuthenticated, exports.createChat);
const sendMessage = async (req, res) => {
    const messageId = (0, uuid_1.v4)();
    const chat = await Chat_1.ChatModel.findOne({ id: req.body.chatId });
    if (chat) {
        chat.messages.push({
            id: messageId,
            senderId: req.user.id,
            message: req.body.message,
            createdAt: Date.now(),
            replyToId: req.body.replyToId
        });
        await chat.save();
        res.json({ message: chat.messages[chat.messages.length - 1] });
    }
    else {
        throw new Error('Chat does not exist');
    }
};
exports.sendMessage = sendMessage;
router_1.router.post('/sendMessage', passport_1.isAuthenticated, exports.sendMessage);
//# sourceMappingURL=chat.js.map