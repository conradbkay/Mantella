"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.taskFields = graphql_tag_1.default `
  fragment taskFields on Task {
    points

    progress

    id
    dueDate
    startDate
    color
    subTasks {
      name
      completed
      id
    }
    security {
      public
      assignedUsers
    }
    recurrance {
      interval
      nextDue
    }
    comments {
      id
      comment
      dateAdded
      lastEdited
    }
    timeWorkedOn
    name
  }
`;
exports.profileFields = graphql_tag_1.default `
  fragment ProfileFields on Profile {
    id
    profileImg
    username
    email
    projects
  }
`;
exports.listFields = graphql_tag_1.default `
  fragment listFields on List {
    id
    name
    taskIds
  }
`;
exports.projectFields = graphql_tag_1.default `
  ${exports.taskFields}
  ${exports.listFields}
  fragment projectFields on Project {
    isPrivate
    ownerId
    lists {
      ...listFields
    }

    users
    tasks {
      ...taskFields
    }
    id
    name
  }
`;
exports.userFields = graphql_tag_1.default `
  ${exports.projectFields}
  fragment userFields on User {
    id
    profileImg
    username
    email
    projects {
      ...projectFields
    }
  }
`;
//# sourceMappingURL=fragments.js.map