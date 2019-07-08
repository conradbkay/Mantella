import {
  EditProjectMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  EditProjectMutation
} from './../../../../client/src/graphql/types'
import { gqlReq, projToSnapshot } from '../../testUtils'

import {
  GQL_CREATE_PROJECT,
  GQL_EDIT_PROJECT,
  GQL_DELETE_PROJECT
} from '../../../../client/src/graphql/mutations/project'

describe('Project Mutations', () => {
  test('createProject and editProject and deleteProject', async () => {
    /* createProject */
    const { data: createData } = await gqlReq<
      CreateProjectMutation,
      CreateProjectMutationVariables
    >({
      query: GQL_CREATE_PROJECT,
      variables: { name: 'project name' },
      isMutation: true
    })

    expect(createData).toBeTruthy()
    expect(createData!.createProject!.name).toBe('project name')

    expect(projToSnapshot(createData!.createProject!)).toMatchSnapshot()

    /* editProject */

    const { data: editData } = await gqlReq<
      EditProjectMutation,
      EditProjectMutationVariables
    >({
      query: GQL_EDIT_PROJECT,
      isMutation: true,
      variables: {
        id: createData!.createProject!.id,
        newProj: { name: 'new name lol', columnIds: ['real smooth'] }
      }
    })

    expect(editData).toBeTruthy()

    expect(editData!.editProject!.name).toBe('new name lol')
    expect(editData!.editProject!.columnOrder).toEqual(['real smooth'])
    expect(editData!.editProject!.id).toBe(createData!.createProject!.id)
    expect(projToSnapshot(editData!.editProject!)).toMatchSnapshot()

    /* deleteProject */

    const { data: deleteData } = await gqlReq<
      DeleteProjectMutation,
      DeleteProjectMutationVariables
    >({
      isMutation: true,
      query: GQL_DELETE_PROJECT,
      variables: {
        id: editData!.editProject!.id
      }
    })

    expect(deleteData!.deleteProject!.id).toBe(editData!.editProject!.id)
  })
})
