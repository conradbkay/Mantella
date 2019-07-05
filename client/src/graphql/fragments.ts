import gql from 'graphql-tag'

export type GQLExec = <T>(variables: T) => any

export const taskFields = gql`
  fragment taskFields on Task {
    points
    completed
    tags
    assignedUsers
    id: _id
    description
    dueDate
    startDate
    recurrance
    color
    subTasks {
      name
      completed
      id: _id
    }
    comments {
      id: _id
      description
      dateAdded
      lastEdited
    }
    timeWorkedOn
    name
  }
`

export const profileFields = gql`
  fragment ProfileFields on Profile {
    id: _id
    profileImg
    username
    email
    projects
  }
`

export const columnFields = gql`
  fragment columnFields on Column {
    id: _id
    name
    isCompletedColumn
    taskIds
    taskLimit
  }
`

export const projectFields = gql`
  ${taskFields}
  ${profileFields}
  ${columnFields}
  fragment projectFields on Project {
    columnIds
    ownerId
    columns {
      ...columnFields
    }
    swimlanes {
      taskIds
      name
      id: _id
    }
    users {
      ...ProfileFields
    }
    tasks {
      ...taskFields
    }
    id: _id
    name
    tags {
      name
      color
      id: _id
    }
  }
`

export const userFields = gql`
  ${projectFields}
  fragment userFields on User {
    id: _id
    profileImg
    username
    email
    projects {
      ...projectFields
    }
  }
`
