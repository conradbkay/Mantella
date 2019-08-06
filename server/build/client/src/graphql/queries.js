"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fragments_1 = require("./fragments");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.GQL_GET_PROJECT = graphql_tag_1.default `
  ${fragments_1.projectFields}

  query project($id: String!) {
    projectById(id: $id) {
      ...projectFields
    }
  }
`;
exports.GQL_GET_PROJECTS = graphql_tag_1.default `
  ${fragments_1.projectFields}

  query projects($ids: [String!]!) {
    projects(ids: $ids) {
      ...projectFields
    }
  }
`;
exports.GQL_GET_USER = graphql_tag_1.default `
  ${fragments_1.userFields}

  query user($id: String!) {
    user(id: $id) {
      ...userFields
    }
  }
`;
//# sourceMappingURL=queries.js.map