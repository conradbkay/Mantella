import {
  CreateTaskMutation,
  CreateTaskMutationVariables,
  EditTaskMutation,
  EditTaskMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables
} from './../../../../client/src/graphql/types'
import {
  GQL_CREATE_TASK,
  GQL_EDIT_TASK,
  GQL_DELETE_TASK
} from './../../../../client/src/graphql/mutations/task'
import { gqlReq, projToSnapshot } from '../../testUtils'

describe('Task Mutations', () => {
  test('createTask', async () => {
    const PROJECT_ID = '5d08076bb7fc44284546db2d'
    const COLUMN_ID = '5d08076bb7fc44284546db2e'

    const { data: createData } = await gqlReq<
      CreateTaskMutation,
      CreateTaskMutationVariables
    >({
      isMutation: true,
      query: GQL_CREATE_TASK,
      variables: {
        projId: PROJECT_ID,
        columnId: COLUMN_ID,
        taskInfo: {
          name: 'new task name'
        }
      }
    })

    expect(createData).toBeTruthy()

    const task = createData!.createTask!.task!

    expect(task.name).toBe('new task name')
    expect({ ...task, id: 'TASK_ID', startDate: 'haha no' }).toMatchSnapshot()

    /* editTask */
    const { data: editData } = await gqlReq<
      EditTaskMutation,
      EditTaskMutationVariables
    >({
      isMutation: true,
      query: GQL_EDIT_TASK,
      variables: {
        projId: PROJECT_ID,
        taskId: task.id,
        newTask: {
          name: 'haha newer name'
        }
      }
    })

    expect(editData!.editTask!.task!.name).toBe('haha newer name')
    expect(editData!.editTask!.task!.id).toBe(task.id)

    expect({
      ...editData!.editTask!.task!,
      id: 'TASK_ID',
      startDate: 'noo'
    }).toMatchSnapshot()

    /* deleteTask */

    const { data: deleteData } = await gqlReq<
      DeleteTaskMutation,
      DeleteTaskMutationVariables
    >({
      isMutation: true,
      query: GQL_DELETE_TASK,
      variables: {
        projId: PROJECT_ID,
        taskId: task.id
      }
    })

    expect(deleteData!.deleteTask!.project!.tasks.length + 1).toBe(
      editData!.editTask!.project!.tasks.length
    )

    expect(projToSnapshot(deleteData!.deleteTask!.project!)).toMatchSnapshot()
  })
  // comments
  // subtasks
})
