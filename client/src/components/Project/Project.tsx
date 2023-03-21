import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper,
  TableBody,
  SpeedDial,
  SpeedDialAction,
  useTheme
} from '@mui/material'
import { TState } from '../../types/state'
import { CreateColumn } from './CreateList'
import Add from '@mui/icons-material/Add'
import Create from '@mui/icons-material/Create'
import { NoMatch } from '../NoMatch/NoMatch'
import Helmet from 'react-helmet'
import { id } from '../../utils/utilities'
import { ProjectCell } from './ProjectCell'
import { CreateTask } from '../Task/Create'
import { EditTaskModal } from '../Task/Edit'
import Color from 'color'
import {
  rectIntersection,
  closestCorners,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import ProjectHeader from './ProjectHeader'
import { BaseTask } from '../Task/Base'
import { cloneDeep } from 'lodash'
import { setProjectA } from '../../store/actions/project'
import { arrayMove } from '@dnd-kit/sortable'
import { APIReplaceListIds } from '../../API/list'
import { Sidebar } from './Sidebar'
import { Socket } from 'socket.io-client'
import { setTaskA } from '../../store/actions/task'
import { APIDeleteTask } from '../../API/task'

/**
 * @todo add a filter menu with color, column, due date, label
 */

type Props = {
  params: {
    id: string
  }
  socket: Socket
}

export const taskDummyOpacity = '0.6'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: taskDummyOpacity
      }
    }
  })
}
export const PROJECT_BORDER_COLOR = '#6E6E6E'
export const PROJECT_BORDER = '1px solid ' + PROJECT_BORDER_COLOR

const PROGRESS_DISPLAYS = ['No Progress', 'In Progress', 'Complete']

// when dragging to an empty list droppable.sortable will be empty
const getDragEventData = ({ active, over }: DragOverEvent | DragEndEvent) => {
  if (over && active.data.current) {
    const taskId = active.id as string
    const fromIdx = active.data.current.sortable.index
    const [fromListId, fromProgress] =
      active.data.current.sortable.containerId.split('|')
    const [toListId, toProgress] = (over.id as string).includes('|')
      ? (over.id as string).split('|')
      : over.data.current!.sortable.containerId.split('|')

    const toIdx = over.data.current ? over.data.current.sortable.index : 0

    return {
      taskId,
      toIdx,
      fromIdx,
      fromListId,
      toListId,
      toProgress: parseInt(toProgress),
      fromProgress: parseInt(fromProgress)
    }
  }
  return null
}

// necessary to allow clicking AND dragging tasks
class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as any,
      handler: ({ nativeEvent }: any) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false
        }

        return true
      }
    }
  ]
}

// we want closestCorners for everything but the trash, while needs to be closestCenter
const customCollisionDetection = ({
  droppableContainers,
  ...args
}: any): any => {
  const rectIntersectionCollisions = rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter(
      ({ id }: any) => id === 'trash'
    )
  })

  // Collision detection algorithms return an array of collisions
  if (rectIntersectionCollisions.length > 0) {
    // The trash is intersecting, return early
    return rectIntersectionCollisions
  }

  // Compute other collisions
  return closestCorners({
    ...args,
    droppableContainers: droppableContainers.filter(
      ({ id }: any) => id !== 'trash'
    )
  })
}

export const Project = (props: Props) => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draggingId, setDraggingId] = useState(null as string | null)
  const [overTrash, setOverTrash] = useState(false)

  const [creating, setCreating] = useState('')
  const [fab, setFab] = useState(false)

  const { project } = useSelector((state: TState) => {
    return {
      project: state.projects[id(state.projects, props.params.id)]
    }
  })

  const dispatch = useDispatch()

  const onDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id as string)
  }

  const onDragOver = (event: DragOverEvent) => {
    if (event.over && event.over.id === 'trash') {
      if (!overTrash) {
        setOverTrash(true)
      }
    } else {
      const data = getDragEventData(event)

      if (event.over && event.active.id !== event.over.id && data) {
        const {
          fromListId,
          toListId,
          toProgress,
          fromProgress,
          toIdx,
          fromIdx,
          taskId
        } = data

        const editLists = cloneDeep(project.lists)

        const [fromList, toList] = [
          editLists[id(editLists, fromListId)],
          editLists[id(editLists, toListId)]
        ]

        if (fromListId === toListId && fromProgress === toProgress) {
          fromList.taskIds[fromProgress] = arrayMove(
            fromList.taskIds[fromProgress],
            fromIdx,
            toIdx
          )
        } else {
          fromList.taskIds[fromProgress].splice(fromIdx, 1)
          toList.taskIds[toProgress].splice(
            fromIdx > toIdx ? toIdx + 1 : toIdx,
            0,
            taskId
          )
        }

        dispatch(
          setProjectA({
            id: project.id,
            newProj: { ...project, lists: editLists }
          })
        )
      }
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === 'trash') {
      console.log('delete')
      dispatch(
        setTaskA({ id: draggingId!, projectId: project.id, newTask: null })
      )
      APIDeleteTask(draggingId!, project.id)
    } else {
      const data = getDragEventData(event)

      if (data) {
        APIReplaceListIds(
          project.id,
          project.lists.map((list) => ({
            id: list.id,
            taskIds: list.taskIds
          }))
        )
      }

      setDraggingId(null)
    }

    if (overTrash) {
      setOverTrash(false)
    }
  }

  const onDragCancel = () => {
    setDraggingId(null)
    setOverTrash(false)
  }

  const sensors = useSensors(
    useSensor(MyPointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor)
  )

  const theme = useTheme()

  if (project) {
    return (
      <>
        <Helmet>
          <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        </Helmet>
        <DndContext
          sensors={sensors}
          autoScroll={false}
          onDragStart={onDragStart}
          collisionDetection={customCollisionDetection}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <ProjectHeader deleteMode={draggingId !== null} project={project} />
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 124px)' }}>
            <Sidebar project={project} socket={props.socket} />
            <Paper
              style={{
                margin: 20,
                padding: '20px 20px 40px',
                minHeight: 'calc(100vh - 328px)'
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed'
                }}
              >
                <TableBody>
                  <tr style={{ display: 'flex' }}>
                    {[0, 1, 2].map((col) => (
                      <td
                        key={col}
                        style={{
                          width: '100%',
                          backgroundColor: new Color(
                            theme.palette.background.paper
                          )
                            .lighten(0.7)
                            .hex()
                            .toString(),
                          borderLeft: col ? 'none' : PROJECT_BORDER,
                          borderRight: PROJECT_BORDER,
                          borderTop: PROJECT_BORDER,
                          borderTopLeftRadius: col ? 0 : 4,
                          borderTopRightRadius: col === 2 ? 4 : 0,
                          textAlign: 'center',
                          color: theme.palette.text.secondary,
                          padding: 8,
                          fontSize: 20
                        }}
                      >
                        {PROGRESS_DISPLAYS[col]}
                      </td>
                    ))}
                  </tr>
                  {project.lists.map((list) => (
                    <tr
                      style={{
                        display: 'flex'
                      }}
                      key={list.id}
                    >
                      {[0, 1, 2].map((progress) => (
                        <ProjectCell
                          draggingId={draggingId}
                          setCreating={(id) => setCreating(id)}
                          openFunc={(tId: string) => {
                            setEditingTaskId(tId)
                          }}
                          key={list.id + progress}
                          progress={progress as 0 | 1 | 2}
                          list={list}
                          project={project}
                        />
                      ))}
                    </tr>
                  ))}
                </TableBody>
              </table>
            </Paper>
          </div>

          <DragOverlay dropAnimation={dropAnimationConfig}>
            {draggingId ? (
              <BaseTask
                project={project}
                task={project.tasks[id(project.tasks, draggingId)]}
                openFunc={() => null}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
        <SpeedDial
          open={fab}
          ariaLabel="create list/create task"
          onClick={() => setDialogOpen(true)}
          onClose={() => setFab(false)}
          onOpen={() => setFab(true)}
          color="primary"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
          direction="up"
          icon={<Add />}
        >
          <SpeedDialAction
            icon={<Create />}
            tooltipTitle="Create Task"
            onClick={(e: any) => {
              e.stopPropagation()
              setCreating(project.lists[0].id)
            }}
          />
        </SpeedDial>

        {creating && (
          <CreateTask
            onClose={() => setCreating('')}
            project={project}
            listId={creating}
          />
        )}
        {dialogOpen && (
          <CreateColumn
            onClose={() => setDialogOpen(false)}
            project={project}
          />
        )}
        {editingTaskId && (
          <EditTaskModal
            taskId={editingTaskId}
            onClose={() => setEditingTaskId('')}
            projectId={project.id}
          />
        )}
      </>
    )
  }
  return <NoMatch />
}
