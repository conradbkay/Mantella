"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const tslib_1 = require("tslib");
/* eslint-disable import/first */
const express_1 = require("express");
const auth_1 = require("./auth");
const passport_1 = require("../passport");
const passport_2 = tslib_1.__importDefault(require("passport"));
// Import project route handlers and validators
const project_1 = require("./project");
// Import list route handlers
const list_1 = require("./list");
// Import task route handlers
const task_1 = require("./task");
// Import user route handlers
const user_1 = require("./user");
exports.router = (0, express_1.Router)();
/* make sure these modules run as they contain router.* methods
 MUST GO AFTER router declaration because otherwise those modules won't have anything to import */
exports.router.post('/logout', auth_1.logout);
exports.router.post('/register', auth_1.validateRegister, auth_1.register);
exports.router.post('/login', auth_1.validateLogin, passport_2.default.authenticate('local', { session: true }), auth_1.login);
exports.router.post('/cookieLogin', passport_1.isAuthenticated, auth_1.login);
exports.router.post('/guestLogin', auth_1.guestLogin);
// Project routes
exports.router.post('/projects', passport_1.isAuthenticated, project_1.getProjects);
exports.router.post('/createProject', passport_1.isAuthenticated, project_1.validateCreateProject, project_1.createProject);
exports.router.post('/editProject', passport_1.isAuthenticated, project_1.validateEditProject, project_1.editProject);
exports.router.post('/deleteProject', passport_1.isAuthenticated, project_1.validateDeleteProject, project_1.deleteProject);
exports.router.post('/leaveProject', passport_1.isAuthenticated, project_1.validateLeaveProject, project_1.leaveProject);
exports.router.post('/kickUserFromProject', passport_1.isAuthenticated, project_1.validateRemoveMember, project_1.kickUserFromProject);
exports.router.post('/getProjectById', passport_1.isAuthenticated, project_1.validateGetProjectById, project_1.getProjectById);
exports.router.post('/shareProject', passport_1.isAuthenticated, project_1.validateShareProject, project_1.shareProject);
exports.router.post('/getProjectMembers', passport_1.isAuthenticated, project_1.validateGetProjectMembers, project_1.getProjectMembers);
// List routes
exports.router.post('/editList', passport_1.isAuthenticated, list_1.validateEditList, list_1.editList);
exports.router.post('/createList', passport_1.isAuthenticated, list_1.validateCreateList, list_1.createList);
exports.router.post('/deleteList', passport_1.isAuthenticated, list_1.validateDeleteList, list_1.deleteList);
exports.router.post('/setListIdx', passport_1.isAuthenticated, list_1.validateSetListIdx, list_1.setListIdx);
// Task routes
exports.router.post('/createTask', passport_1.isAuthenticated, task_1.validateCreateTask, task_1.createTask);
exports.router.post('/editTask', passport_1.isAuthenticated, task_1.validateEditTask, task_1.editTask);
exports.router.post('/deleteTask', passport_1.isAuthenticated, task_1.validateDeleteTask, task_1.deleteTask);
exports.router.post('/dragTask', passport_1.isAuthenticated, task_1.validateDragTask, task_1.dragTask);
exports.router.post('/setSubtask', passport_1.isAuthenticated, task_1.validateSetSubtask, task_1.setSubtask);
exports.router.post('/setComment', passport_1.isAuthenticated, task_1.validateSetComment, task_1.setComment);
exports.router.post('/assignUserToTask', passport_1.isAuthenticated, task_1.validateAssignUserToTask, task_1.assignUserToTask);
exports.router.post('/replaceListIds', passport_1.isAuthenticated, task_1.replaceListIds);
exports.router.post('/setEmail', passport_1.isAuthenticated, user_1.setEmail);
exports.router.post('/setName', passport_1.isAuthenticated, user_1.setName);
exports.router.post('/setPassword', passport_1.isAuthenticated, user_1.setPassword);
//# sourceMappingURL=router.js.map