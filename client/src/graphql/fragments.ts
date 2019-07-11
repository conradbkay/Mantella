import gql from 'graphql-tag'

export type GQLExec = <T>(variables: T) => any

export const taskFields = gql`
  fragment taskFields on Task {
    points
    completed
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
`

export const profileFields = gql`
  fragment ProfileFields on Profile {
    id
    profileImg
    username
    email
    projects
  }
`

export const columnFields = gql`
  fragment columnFields on Column {
    id
    name
    taskIds
    taskLimit
  }
`

export const projectFields = gql`
  ${taskFields}
  ${columnFields}
  fragment projectFields on Project {
    isPrivate
    columnOrder
    ownerId
    columns {
      ...columnFields
    }
    swimlanes {
      taskIds
      name
      id
    }

    users
    tasks {
      ...taskFields
    }
    id
    name
  }
`

export const userFields = gql`
  ${projectFields}
  fragment userFields on User {
    id
    profileImg
    username
    email
    projects {
      ...projectFields
    }
  }
`
