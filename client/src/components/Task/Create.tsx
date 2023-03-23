import { Button } from '@mui/material'
import { TProject, TTask } from '../../types/project'
import { APICreateTask } from '../../API/task'
import { EditTaskBase } from './EditBase'
import { SET_PROJECT } from '../../store/projects'
import { useAppDispatch } from '../../store/hooks'

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
    try {
      const res = await APICreateTask(props.project.id, listId, {
        points: task.points,
        color: task.color,
        name: task.name,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.toString() : undefined
      })
      if (res && res.project) {
        dispatch(
          SET_PROJECT({
            id: res.project.id,
            project: res.project
          })
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      props.onClose()
    }
  }

  return (
    <EditTaskBase
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
