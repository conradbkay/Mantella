import { Button } from '@mui/material'
import { connect } from 'react-redux'
import { setProjectA } from '../../store/actions/project'
import { TProject, TTask } from '../../types/project'
import { APICreateTask } from '../../API/task'
import { EditTaskBase } from './EditBase'
const actionCreators = {
  setProject: setProjectA
}

type OwnProps = {
  onClose: () => void
  project: TProject
  listId: string
}

type ActionCreators = typeof actionCreators

interface TProps extends OwnProps, ActionCreators {}

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

export const CreateTask = connect(
  null,
  actionCreators
)((props: TProps) => {
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
        props.setProject({
          id: res.project.id,
          newProj: res.project
        })
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
})
