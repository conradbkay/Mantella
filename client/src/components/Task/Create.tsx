import { Button } from '@mui/material'
import { TProject, TTask } from '../../types/project'
import { EditTaskBase } from './EditBase'
import { useAppDispatch } from '../../store/hooks'
import { createTask } from '../../actions/task'

type OwnProps = {
  onClose: () => void
  project: TProject
  listId: string
}

const defaultTask: TTask = {
  name: '',
  points: 0,
  subTasks: [],
  id: '',
  createdAt: new Date().toString(),
  progress: 0,
  timeWorkedOn: 0,
  comments: [],
  dueDate: null,
  color: '#FFFFFF',
  assignedTo: []
}

export const CreateTask = (props: OwnProps) => {
  const dispatch = useAppDispatch()

  const createTaskExec = async (task: TTask, listId: string) => {
    createTask(dispatch, task, listId, props.project.id)
    props.onClose()
  }

  return (
    <EditTaskBase
      title="Create Task"
      projectId={props.project.id}
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
