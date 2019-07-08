import {
  GQL_CREATE_COLUMN,
  GQL_EDIT_COLUMN,
  GQL_DELETE_COLUMN
} from './../../../../client/src/graphql/mutations/column'
import {
  CreateColumnMutation,
  CreateColumnMutationVariables,
  EditColumnMutation,
  EditColumnMutationVariables,
  DeleteColumnMutation,
  DeleteColumnMutationVariables
} from './../../../../client/src/graphql/types'
import { gqlReq, projToSnapshot } from '../../testUtils'

describe('Column Mutations', () => {
  test('createColumn editColumn deleteColumn', async () => {
    const PROJECT_ID = '5d0802a03c5daa2803c62742'

    const { data: createData } = await gqlReq<
      CreateColumnMutation,
      CreateColumnMutationVariables
    >({
      isMutation: true,
      query: GQL_CREATE_COLUMN,
      variables: { projId: PROJECT_ID, name: 'column name' }
    })

    expect(createData!.createColumn).toBeTruthy()

    const col = createData!.createColumn!.column!

    expect(
      createData!.createColumn!.project!.columnOrder!.includes(col.id)
    ).toBeTruthy()
    expect(col.name).toBe('column name')
    expect(
      projToSnapshot({
        ...createData!.createColumn!.project!,
        columns: [],
        columnIds: []
      })
    ).toMatchSnapshot()

    /* edit column */

    const { data: editData } = await gqlReq<
      EditColumnMutation,
      EditColumnMutationVariables
    >({
      isMutation: true,
      query: GQL_EDIT_COLUMN,
      variables: {
        projectId: PROJECT_ID,
        id: col.id,
        newCol: {
          name: 'new name lol',
          taskLimit: 10,
          taskIds: ['lol taskId']
        }
      }
    })

    const newCol = editData!.editColumn!.column!

    expect({
      name: newCol.name,
      taskIds: newCol.taskIds,
      id: newCol.id,
      wipLimit: newCol.taskLimit
    }).toEqual({
      name: 'new name lol',
      taskIds: ['lol taskId'],
      id: col.id,
      wipLimit: 10
    })

    expect({ ...newCol, id: 'LOLCOLID' }).toMatchSnapshot()

    /* delete column */

    const { data: deleteData } = await gqlReq<
      DeleteColumnMutation,
      DeleteColumnMutationVariables
    >({
      isMutation: true,
      query: GQL_DELETE_COLUMN,
      variables: {
        projectId: PROJECT_ID,
        id: newCol.id
      }
    })

    expect(
      deleteData!.deleteColumn!.project!.columnOrder.includes(newCol.id)
    ).toBe(false)

    expect(
      deleteData!.deleteColumn!.project!.columns.findIndex(
        (coll) => coll.id === newCol.id
      )
    ).toBe(-1)

    expect(projToSnapshot(deleteData!.deleteColumn!.project!)).toMatchSnapshot()
  })
})
