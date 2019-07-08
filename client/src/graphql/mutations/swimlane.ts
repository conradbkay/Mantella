import gql from 'graphql-tag'
import { projectFields } from '../fragments'

export const GQL_CREATE_SWIMLANE = gql`
  ${projectFields}
  mutation createSwimlane($projId: String!, $name: String!) {
    createSwimlane(projId: $projId, name: $name) {
      project {
        ...projectFields
      }
      swimlane {
        taskIds
        name
        id
      }
    }
  }
`

export const GQL_EDIT_SWIMLANE = gql`
  ${projectFields}

  mutation editSwimlane(
    $projId: String!
    $newSwim: SwimlaneInput!
    $swimId: String!
  ) {
    editSwimlane(projId: $projId, newSwim: $newSwim, swimId: $swimId) {
      project {
        ...projectFields
      }
      swimlane {
        taskIds
        name
        id
      }
    }
  }
`

export const GQL_DELETE_SWIMLANE = gql`
  ${projectFields}

  mutation deleteSwimlane($projId: String!, $swimId: String!) {
    deleteSwimlane(projId: $projId, _id: $swimId) {
      project {
        ...projectFields
      }
    }
  }
`
