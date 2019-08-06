"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const fragments_1 = require("../fragments");
exports.GQL_CREATE_LIST = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation createList($name: String!, $projId: String!) {
    createList(projId: $projId, name: $name) {
      project {
        ...projectFields
      }
      list {
        ...listFields
      }
    }
  }
`;
exports.GQL_DELETE_LIST = graphql_tag_1.default `
  mutation deleteList($projectId: String!, $id: String!) {
    deleteList(projId: $projectId, id: $id) {
      id
    }
  }
`;
exports.GQL_EDIT_LIST = graphql_tag_1.default `
  ${fragments_1.listFields}

  mutation editList($id: String!, $projectId: String!, $newList: ListInput!) {
    editList(listId: $id, projId: $projectId, newList: $newList) {
      list {
        ...listFields
      }
      project {
        ...projectFields
      }
    }
  }
`;
//# sourceMappingURL=list.js.map