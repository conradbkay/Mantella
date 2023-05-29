"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeProject = exports.serializeProject = void 0;
// if we ever want to allow local file download and upload, make these real
const serializeProject = (project) => {
    const projectJSON = JSON.stringify(project);
    return projectJSON;
};
exports.serializeProject = serializeProject;
const deserializeProject = (projectJSON) => {
    const project = JSON.parse(projectJSON);
    return project;
};
exports.deserializeProject = deserializeProject;
//# sourceMappingURL=serialization.js.map