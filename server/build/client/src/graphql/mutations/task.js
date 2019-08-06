"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fragments_1 = require("./../fragments");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.GQL_SET_SUBTASK = graphql_tag_1.default `
  ${fragments_1.taskFields}

  mutation setSubtask(
    $projId: String!
    $taskId: String!
    $subtaskId: String!
    $info: SubtaskInfo
  ) {
    setSubtask(
      projId: $projId
      taskId: $taskId
      subtaskId: $subtaskId
      info: $info
    ) {
      ...taskFields
    }
  }
`;
exports.GQL_SET_COMMENT = graphql_tag_1.default `
  ${fragments_1.taskFields}

  mutation setComment(
    $projId: String!
    $taskId: String!
    $commentId: String!
    $description: String
  ) {
    setComment(
      projId: $projId
      taskId: $taskId
      commentId: $commentId
      description: $description
    ) {
      ...taskFields
    }
  }
`;
exports.GQL_CREATE_TASK = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation createTask(
    $taskInfo: TaskInput!
    $projId: String!
    $listId: String!
  ) {
    createTask(taskInfo: $taskInfo, projId: $projId, listId: $listId) {
      project {
        ...projectFields
      }

      task {
        ...taskFields
      }
    }
  }
`;
exports.GQL_EDIT_TASK = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation editTask($projId: String!, $taskId: String!, $newTask: TaskInput!) {
    editTask(projId: $projId, taskId: $taskId, task: $newTask) {
      project {
        ...projectFields
      }
      task {
        ...taskFields
      }
    }
  }
`;
exports.GQL_DELETE_TASK = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation deleteTask($projId: String!, $taskId: String!) {
    deleteTask(projId: $projId, id: $taskId) {
      project {
        ...projectFields
      }
    }
  }
`;
exports.GQL_DRAG_TASK = graphql_tag_1.default `
  ${fragments_1.projectFields}

  mutation dragTask(
    $oldListId: String!
    $newListId: String!
    $newIndex: Int!
    $id: String!
    $newProgress: Int!
    $projectId: String!
  ) {
    dragTask(
      oldListId: $oldListId
      newListId: $newListId
      newIndex: $newIndex
      id: $id
      newProgress: $newProgress
      projectId: $projectId
    ) {
      task {
        ...taskFields
      }
      project {
        ...projectFields
      }
    }
  }
`;
//# sourceMappingURL=task.js.map