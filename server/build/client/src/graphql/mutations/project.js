"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const fragments_1 = require("../fragments");
exports.GQL_CREATE_PROJECT = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation createProject($name: String!) {
    createProject(name: $name) {
      ...projectFields
    }
  }
`;
exports.GQL_DELETE_PROJECT = graphql_tag_1.default `
  mutation deleteProject($id: String!) {
    deleteProject(id: $id) {
      id
    }
  }
`;
exports.GQL_EDIT_PROJECT = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation editProject($id: String!, $newProj: ProjectInput!) {
    editProject(newProj: $newProj, id: $id) {
      ...projectFields
    }
  }
`;
//# sourceMappingURL=project.js.map