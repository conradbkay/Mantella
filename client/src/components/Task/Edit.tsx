import { Button } from '@mui/material'
import { id } from '../../utils/utilities'
import { useDispatch, useSelector } from 'react-redux'
import Delete from '@mui/icons-material/Delete'
import { TTask } from '../../types/project'
import { APIEditTask } from '../../API/task'
//import { convertToRaw } from 'draft-js'
import { EditTaskBase } from './EditBase'
import { TState } from '../../types/state'
import { SET_TASK } from '../../store/projects'
import { deleteTask, dragTask } from '../../actions/task'

type OwnProps = {
  onClose: () => void
  taskId: string
  projectId: string
}

/** TODO:
 * better code support (several themes and languages)
 * better editor features (fitting headers, colors, etc)
 * make rendering in task base work for everything
 */

export const EditTaskModal = (props: OwnProps) => {
  const dispatch = useDispatch()
  const { projects } = useSelector((state: TState) => ({
    projects: state.projects
  }))
  const project = projects[id(projects, props.projectId)]
  const task = project.tasks[id(project.tasks, props.taskId)]

  const ownerList = project.lists.find((list) =>
    list.taskIds.flat(1).includes(props.taskId)
  )

  if (!ownerList) {
    props.onClose()
    return null
  }

  const drag = (newId: string) => {
    let progress = 0

    project.lists.forEach((list) => {
      list.taskIds.forEach((ids, i) => {
        if (ids.includes(props.taskId)) {
          progress = i
        }
      })
    })

    dragTask(dispatch, project, progress, ownerList, newId, props.taskId)
  }

  const confirmChanges = (task: TTask, listId: string) => {
    console.log(task.description)
    dispatch(
      SET_TASK({
        id: props.taskId,
        projectId: props.projectId,
        newTask: task
      })
    )

    APIEditTask(task, props.projectId)

    if (listId !== ownerList.id) {
      drag(listId)
    }
  }

  return (
    <EditTaskBase
      ownerListId={ownerList.id}
      projectId={project.id}
      onClose={props.onClose}
      task={task}
      onSave={confirmChanges}
      SecondaryAction={
        <Button
          onClick={() => {
            props.onClose()
            deleteTask(dispatch, props.taskId, project.id)
          }}
          style={{ backgroundColor: 'red', color: 'white', marginRight: 8 }}
        >
          Delete
          <Delete style={{ marginLeft: 'auto' }} />
        </Button>
      }
    />
  )
}
