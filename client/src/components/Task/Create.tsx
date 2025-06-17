import { Button } from '@mui/material'
import { EditTaskBase } from './EditBase'
import { useCreateTaskMutation } from '../../store/api'
import { ApiTask } from '@shared/types'

type OwnProps = {
  onClose: () => void
  projectId: string
  listId: string
}

const defaultTask: ApiTask = {
  name: '',
  points: 0,
  subTasks: [],
  id: '',
  createdAt: new Date().toString(),
  workedOnMs: 0,
  comments: [],
  color: '#FFFFFF',
  assignedTo: [],
  projectId: ''
}

export const CreateTask = (props: OwnProps) => {
  const [createTask] = useCreateTaskMutation()

  const createTaskExec = async (task: ApiTask, listId: string) => {
    createTask({ taskInfo: task, listId, projId: props.projectId })
    props.onClose()
  }

  return (
    <EditTaskBase
      title="Create Task"
      projectId={props.projectId}
      onClose={() => props.onClose()}
      task={defaultTask}
      ownerListId={props.listId}
      onSave={createTaskExec}
      SecondaryAction={
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
      }
    />
  )
}
