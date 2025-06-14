"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = exports.editChannel = exports.deleteChannel = exports.createChannel = exports.sendMessage = exports.getChat = void 0;
const Project_1 = require("../models/Project");
const nanoid_1 = require("nanoid");
const router_1 = require("./router");
const passport_1 = require("../passport");
const Chat_1 = require("../models/Chat");
const getChat = async (req, res) => {
    const chat = await Chat_1.ChatModel.findOne({ id: req.body.id });
    res.json({ chat });
};
exports.getChat = getChat;
router_1.router.post('/chat', passport_1.isAuthenticated, exports.getChat);
const sendMessage = async (req, res) => {
    const messageId = (0, nanoid_1.nanoid)();
    const chat = await Chat_1.ChatModel.findOne({ id: req.body.chatId });
    if (chat) {
        chat.messages.unshift({
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
const createChannel = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        const name = req.body.name || 'New Channel';
        const chatId = (0, nanoid_1.nanoid)();
        await Chat_1.ChatModel.create({
            id: chatId,
            projectId: req.body.projId,
            name,
            messages: []
        });
        proj.channels.push([chatId, name]);
        await proj.save();
        res.json({ project: proj });
    }
    else {
        throw new Error('Project does not exist');
    }
};
exports.createChannel = createChannel;
router_1.router.post('/createChannel', passport_1.isAuthenticated, exports.createChannel);
const deleteChannel = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        proj.channels = proj.channels.filter((channel) => channel[0] !== req.body.id);
        await proj.save();
        res.json({ project: proj });
    }
    else {
        throw new Error('Project does not exist');
    }
};
exports.deleteChannel = deleteChannel;
router_1.router.post('/deleteChannel', passport_1.isAuthenticated, exports.deleteChannel);
const editChannel = async (req, res) => {
    const proj = await Project_1.ProjectModel.findOne({ id: req.body.projId });
    if (proj) {
        const channelIdx = proj.channels.findIndex((channel) => channel[0] === req.body.id);
        if (channelIdx >= 0) {
            proj.channels[channelIdx][1] = req.body.name;
            proj.markModified('channels');
            await proj.save();
            res.json(proj);
        }
        else {
            throw new Error('Channel does not exist');
        }
    }
    else {
        throw new Error('Project does not exist');
    }
};
exports.editChannel = editChannel;
router_1.router.post('/editChannel', passport_1.isAuthenticated, exports.editChannel);
const createChat = async (projectId) => {
    const chatId = (0, nanoid_1.nanoid)();
    await Chat_1.ChatModel.create({
        id: chatId,
        messages: [],
        projectId: projectId
    });
    return [chatId, 'General'];
};
exports.createChat = createChat;
//# sourceMappingURL=chat.js.map