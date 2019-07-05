import { GQL_GET_USER } from './../../../../client/src/graphql/queries'
import {
  ProjectQuery,
  ProjectQueryVariables,
  UserQuery,
  UserQueryVariables
} from './../../../../client/src/graphql/types'
import { gqlReq } from '../../testUtils'
import { GQL_GET_PROJECT } from '../../../../client/src/graphql/queries'

describe('GQL Queries', () => {
  test('Projects and projectById', async () => {
    const { data: projectData } = await gqlReq<
      ProjectQuery,
      ProjectQueryVariables
    >({
      isMutation: false,
      query: GQL_GET_PROJECT,
      variables: {
        id: '5d08fbce79d3d5773e47fd90'
      }
    })

    expect(projectData!.projectById!.id).toBe('5d08fbce79d3d5773e47fd90')
    expect(projectData!.projectById!).toMatchSnapshot()

    // ids: ['5d08fbce79d3d5773e47fd90', '5d08fbd9c53c0477859eeb56']
  })

  test('Gets user', async () => {
    const { data: userData } = await gqlReq<UserQuery, UserQueryVariables>({
      isMutation: false,
      query: GQL_GET_USER,
      variables: {
        id: '5d04064a9b99a535a2a28950'
      }
    })

    expect(userData!.user).toBeTruthy()

    expect(userData!.user!.id).toBe('5d04064a9b99a535a2a28950')
  })
})
