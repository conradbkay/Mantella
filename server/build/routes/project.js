"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = exports.getProjectMembers = exports.shareProject = exports.getProjectById = exports.kickUserFromProject = exports.leaveProject = exports.deleteProject = exports.editProject = exports.createProject = exports.validateGetProjectMembers = exports.validateGetProjectById = exports.validateShareProject = exports.validateRemoveMember = exports.validateLeaveProject = exports.validateDeleteProject = exports.validateEditProject = exports.validateCreateProject = void 0;
const zod_1 = require("zod");
const user_1 = require("../db/user");
const project_1 = require("../db/project");
const nanoid_1 = require("nanoid");
const data_1 = require("../data");
const db_1 = require("../db/db");
const toApi_1 = require("../db/toApi");
const validate_1 = require("../middleware/validate");
// Zod validation schemas
const createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Project name is required'),
    public: zod_1.z.boolean().optional()
});
const editProjectSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Project ID is required'),
    newProj: zod_1.z.object({
        name: zod_1.z.string().optional(),
        colors: zod_1.z.array(zod_1.z.string()).optional()
    })
});
const deleteProjectSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Project ID is required')
});
const leaveProjectSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'Project ID is required')
});
const removeMemberSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'Project ID is required'),
    userId: zod_1.z.string().min(1, 'User ID is required')
});
const shareProjectSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'Project ID is required'),
    email: zod_1.z.string().email('Valid email is required')
});
const getProjectByIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Project ID is required')
});
const getProjectMembersSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'Project ID is required')
});
exports.validateCreateProject = (0, validate_1.validateRequest)(createProjectSchema);
exports.validateEditProject = (0, validate_1.validateRequest)(editProjectSchema);
exports.validateDeleteProject = (0, validate_1.validateRequest)(deleteProjectSchema);
exports.validateLeaveProject = (0, validate_1.validateRequest)(leaveProjectSchema);
exports.validateRemoveMember = (0, validate_1.validateRequest)(removeMemberSchema);
exports.validateShareProject = (0, validate_1.validateRequest)(shareProjectSchema);
exports.validateGetProjectById = (0, validate_1.validateRequest)(getProjectByIdSchema);
exports.validateGetProjectMembers = (0, validate_1.validateRequest)(getProjectMembersSchema);
const createProject = async (req, res, next) => {
    try {
        const { name, public: isPublic } = createProjectSchema.parse(req.body);
        const user = req.user;
        const listId = (0, nanoid_1.nanoid)();
        const created = await (0, project_1.createProject)({
            name,
            ownerId: user.id,
            colors: data_1.defaultColors,
            securityPublic: isPublic || false
        });
        await (0, project_1.addUserToProject)(created.id, user.id);
        await db_1.db
            .insertInto('lists')
            .values({
            id: listId,
            projectId: created.id,
            name: 'Generic',
            orderIndex: 0
        })
            .execute();
        const fullProject = await (0, toApi_1.getFullProject)(created.id);
        res.json({ project: fullProject });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const editProject = async (req, res, next) => {
    try {
        const { id, newProj } = editProjectSchema.parse(req.body);
        const updates = {};
        if (newProj.name) {
            updates.name = newProj.name;
        }
        if (newProj.colors) {
            updates.colors = JSON.stringify(newProj.colors);
        }
        await (0, project_1.updateProject)(id, updates);
        const fullProject = await (0, toApi_1.getFullProject)(id);
        res.json({ project: fullProject });
    }
    catch (error) {
        next(error);
    }
};
exports.editProject = editProject;
const deleteProject = async (req, res, next) => {
    try {
        const { id } = deleteProjectSchema.parse(req.body);
        await (0, project_1.deleteProject)(id);
        res.json({ id });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
const leaveProject = async (req, res, next) => {
    try {
        const { projectId } = leaveProjectSchema.parse(req.body);
        const user = req.user;
        await db_1.db
            .deleteFrom('projectUsers')
            .where('projectId', '=', projectId)
            .where('userId', '=', user.id)
            .execute();
        res.json({ message: 'Successfully left project' });
    }
    catch (error) {
        next(error);
    }
};
exports.leaveProject = leaveProject;
const kickUserFromProject = async (req, res, next) => {
    try {
        const { projectId, userId } = removeMemberSchema.parse(req.body);
        await db_1.db
            .deleteFrom('projectUsers')
            .where('projectId', '=', projectId)
            .where('userId', '=', userId)
            .execute();
        const fullProject = await (0, toApi_1.getFullProject)(projectId);
        res.json({ project: fullProject });
    }
    catch (error) {
        next(error);
    }
};
exports.kickUserFromProject = kickUserFromProject;
const getProjectById = async (req, res, next) => {
    try {
        const { id } = getProjectByIdSchema.parse(req.body);
        const project = await (0, toApi_1.getFullProject)(id);
        res.json({ project });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectById = getProjectById;
const shareProject = async (req, res, next) => {
    try {
        const { projectId, email } = shareProjectSchema.parse(req.body);
        const userToShareWith = await (0, user_1.findUserByEmail)(email);
        if (!userToShareWith) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await (0, project_1.addUserToProject)(projectId, userToShareWith.id);
        const fullProject = await (0, toApi_1.getFullProject)(projectId);
        res.json({ project: fullProject });
    }
    catch (error) {
        next(error);
    }
};
exports.shareProject = shareProject;
const getProjectMembers = async (req, res, next) => {
    try {
        const { projectId } = getProjectMembersSchema.parse(req.body);
        const project = await (0, toApi_1.getFullProject)(projectId);
        res.json({ users: project?.users || [] });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectMembers = getProjectMembers;
const getProjects = async (req, res, next) => {
    try {
        const user = req.user;
        const projects = await (0, project_1.findProjectsByUserId)(user.id);
        const fullProjects = await Promise.all(projects.map((p) => (0, toApi_1.getFullProject)(p.id)));
        res.json(fullProjects);
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
//# sourceMappingURL=project.js.map