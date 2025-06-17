import { Button } from '@mui/material'
import { id } from '../../utils/utils'
import Delete from '@mui/icons-material/Delete'
import { TTask } from '../../types/project'
import { EditTaskBase } from './EditBase'
import {
  useDeleteTaskMutation,
  useGetProjectsQuery,
  useEditTaskMutation,
  useDragTaskMutation
} from '../../store/api'

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
  const { data: projects } = useGetProjectsQuery()

  const [deleteTaskMutation] = useDeleteTaskMutation()
  const [editTaskMutation] = useEditTaskMutation()
  const [dragTaskMutation] = useDragTaskMutation()
  if (!projects) {
    return null
  }

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

    dragTaskMutation({
      taskId: props.taskId,
      projectId: project.id,
      toListId: newId,
      toProgress: progress,
      toIdx: 0
    })
  }

  const confirmChanges = (task: TTask, listId: string) => {
    editTaskMutation({
      taskId: props.taskId,
      projId: project.id,
      task: task
    })

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
            deleteTaskMutation({
              id: props.taskId,
              projId: project.id
            })
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
