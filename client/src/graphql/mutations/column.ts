import gql from 'graphql-tag'
import { projectFields, columnFields } from '../fragments'

export const GQL_CREATE_COLUMN = gql`
  ${projectFields}

  mutation createColumn(
    $name: String!
    $projId: String!
    $isCompletedColumn: Boolean
    $taskLimit: Int
  ) {
    createColumn(
      projId: $projId
      name: $name
      isCompletedColumn: $isCompletedColumn
      taskLimit: $taskLimit
    ) {
      project {
        ...projectFields
      }
      column {
        ...columnFields
      }
    }
  }
`

export const GQL_DELETE_COLUMN = gql`
  ${projectFields}

  mutation deleteColumn($projectId: String!, $id: String!) {
    deleteColumn(projectId: $projectId, _id: $id) {
      project {
        ...projectFields
      }
    }
  }
`

export const GQL_EDIT_COLUMN = gql`
  ${columnFields}

  mutation editColumn(
    $id: String!
    $projectId: String!
    $newCol: ColumnInput!
  ) {
    editColumn(colId: $id, projectId: $projectId, newCol: $newCol) {
      column {
        ...columnFields
      }
    }
  }
`
