import { Button } from '@mui/material'
import { id } from '../../utils/utilities'
import { useDispatch, useSelector } from 'react-redux'
import Delete from '@mui/icons-material/Delete'
import { TTask } from '../../types/project'
import { APIDeleteTask, APIDragTask, APIEditTask } from '../../API/task'
//import { convertToRaw } from 'draft-js'
import { EditTaskBase } from './EditBase'
import { TState } from '../../types/state'
import { SET_PROJECT, SET_TASK } from '../../store/projects'

type OwnProps = {
  onClose: () => void
  taskId: string
  projectId: string
}

/** todo:
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

  const deleteTask = () => {
    dispatch(
      SET_TASK({
        id: props.taskId,
        projectId: props.projectId,
        newTask: undefined
      })
    )
    APIDeleteTask(props.taskId, props.projectId)
  }

  const drag = async (newId: string) => {
    let progress = 0

    project.lists.forEach((list) => {
      list.taskIds.forEach((ids, i) => {
        if (ids.includes(props.taskId)) {
          progress = i
        }
      })
    })

    const data = await APIDragTask({
      projectId: project.id,
      oldListId: ownerList.id,
      newListId: newId,
      oldProgress: progress,
      newProgress: progress,
      oldListReplaceIds: project.lists[id(project.lists, ownerList.id)].taskIds[
        progress
      ].filter((id) => id !== props.taskId),
      newListReplaceIds: [
        props.taskId,
        ...project.lists[id(project.lists, newId)].taskIds[progress]
      ]
    })

    dispatch(SET_PROJECT({ id: project.id, project: data.project }))
  }

  const confirmChanges = (task: TTask, listId: string) => {
    //const taskWithDescription: TTask = {
    //...task,
    //description: JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    // }

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
            deleteTask()
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
