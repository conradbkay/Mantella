import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper,
  TableBody,
  SpeedDial,
  SpeedDialAction,
  useTheme,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  ButtonBase
} from '@mui/material'
import { TState } from '../../types/state'
import { CreateList } from './CreateList'
import Add from '@mui/icons-material/Add'
import Create from '@mui/icons-material/Create'
import { NoMatch } from '../NoMatch/NoMatch'
import Helmet from 'react-helmet'
import { id } from '../../utils/utilities'
import { ProjectCell } from './Cell'
import { CreateTask } from '../Task/Create'
import { EditTaskModal } from '../Task/Edit'
import Color from 'color'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'

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
import ProjectHeader from './Header'
import { BaseTask } from '../Task/Base'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import { APIReplaceListIds } from '../../API/list'
import { Sidebar } from './Sidebar'
import { Socket } from 'socket.io-client'
import { APIAssignUserToTask, APIDeleteTask } from '../../API/task'
import { CalendarWeek } from '../Calendar/Week'
import { OPEN_SNACKBAR } from '../../store/snackbar'
import { SET_PROJECT, SET_TASK } from '../../store/projects'
import { TTask } from '../../types/project'

/**
 * @todo add a filter menu with color, column, due date, label
 */

const sortTasks = (sortType: string, tasks: TTask[]) => {
  if (sortType === 'default') {
    return tasks
  }

  return [...tasks].sort((a, b) => {
    if (sortType === 'points') {
      return b.points - a.points
    } else if (sortType === 'due date') {
      // overdue, then due, then no date date
      return (
        (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
        (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
      )
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}

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
      // draggable avatar or trash
      ({ id }: any) => id === 'trash' || id.split('|').length > 2
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
  const [viewType, setViewType] = useState<'kanban' | 'list' | 'calendar'>(
    'kanban'
  )
  const [listSort, setListSort] = useState<
    'default' | 'points' | 'due date' | 'newest'
  >('default')

  const [creating, setCreating] = useState('')
  const [fab, setFab] = useState(false)

  const { project } = useSelector((state: TState) => {
    return {
      project: state.projects[id(state.projects, props.params.id)]
    }
  })

  const dispatch = useDispatch()

  const onDragStart = (event: DragStartEvent) => {
    if ((event.active.id as any).slice(0, 4) === 'user') {
    } else {
      setDraggingId(event.active.id as string)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    if (event.over && event.over.id === 'trash') {
      /**
       * @todo I can't think of a good way to remove the task from redux so it doesn't show when hovering delete
       * maybe we store a copy of the project in this component like the editTask component and save those to both redux and the server, possibly with better D&D performance. Even then,
       */
      if (!overTrash) {
        setOverTrash(true)
      }
    } else if (event.over && (event.active.id as any).slice(0, 4) === 'user') {
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
          SET_PROJECT({
            id: project.id,
            project: { ...project, lists: editLists }
          })
        )
      }
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    if (event.over && event.over.id === 'trash') {
      dispatch(OPEN_SNACKBAR({ message: 'Task deleted', variant: 'undo' }))
      dispatch(
        SET_TASK({ id: draggingId!, projectId: project.id, newTask: undefined })
      )
      // they will have 5 seconds to undo with the snackbar by reloading the page so that the request does not get sent
      setTimeout(() => {
        APIDeleteTask(draggingId!, project.id)
      }, 5500)
    } else if ((event.active.id as string).split('|').length === 3) {
      const [, taskId, userId] = (event.active.id as string).split('|')

      const remove = async () => {
        dispatch(
          SET_TASK({
            id: taskId,
            projectId: project.id,
            newTask: {
              assignedTo: (
                project.tasks[id(project.tasks, taskId)].assignedTo || []
              ).filter((id: string) => id !== userId)
            }
          })
        )
        APIAssignUserToTask({
          userId,
          taskId,
          projId: project.id
        })
      }
      if (
        !event.over ||
        (taskId !== event.over.id && event.over.id === 'users')
      ) {
        remove()
      } else if (taskId !== event.over.id) {
        // to another task, or to a list
        const task = project.tasks.find((task) => task.id === event.over!.id)

        if (task && !task.assignedTo.includes(userId)) {
          dispatch(
            SET_TASK({
              id: event.over.id as string,
              projectId: project.id,
              newTask: {
                assignedTo: [...(task.assignedTo || []), userId]
              }
            })
          )
          // since both of the following functions modify the same data, we need to avoid race conditions by doing one first on the server
          await remove()

          APIAssignUserToTask({
            userId,
            taskId: event.over.id as string,
            projId: project.id
          })
        } else {
          remove()
        }
      }
    } else if (event.over && (event.active.id as any).slice(0, 4) === 'user') {
      const task = project.tasks[id(project.tasks, event.over.id as string)]
      const userId = (event.active.id as string).slice(5)

      let newAssigned = [...(task.assignedTo || [])]

      if (newAssigned.includes(userId)) {
        newAssigned.splice(newAssigned.indexOf(userId), 1)
      } else {
        newAssigned.push(userId)
      }

      dispatch(
        SET_TASK({
          id: event.over.id as string,
          projectId: project.id,
          newTask: { assignedTo: newAssigned }
        })
      )

      APIAssignUserToTask({
        userId,
        taskId: event.over.id as string,
        projId: project.id
      })
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
    }
    setDraggingId(null)

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
    // TODO: isn't working
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
          <ProjectHeader
            setCreating={() => setCreating(project.lists[0].id)}
            setViewType={(newType: string) => {
              setViewType(newType as any)
            }}
            viewType={viewType}
            deleteMode={draggingId !== null}
            project={project}
          />
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 124px)' }}>
            <Sidebar project={project} socket={props.socket} />
            <Paper
              style={{
                margin: 20,
                width: '100%',
                padding: '20px 20px 40px',
                minHeight: 'calc(100vh - 328px)'
              }}
            >
              {viewType === 'kanban' ? (
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
                            color: theme.palette.text.secondary,
                            padding: 8,
                            display: 'flex',
                            userSelect: 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 20
                          }}
                        >
                          <CheckCircleOutline
                            style={{
                              paddingRight: 8,
                              color:
                                col === 2
                                  ? theme.palette.success.main
                                  : col
                                  ? theme.palette.warning.main
                                  : undefined
                            }}
                          />
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
                    <tr>
                      <td>
                        <ButtonBase
                          onClick={() => setDialogOpen(true)}
                          style={{
                            width: '100%',
                            color: theme.palette.primary.main,
                            fontSize: 18,
                            height: 64,
                            // for some reason putting border in parent makes it jut out by 1px on each side
                            border: PROJECT_BORDER,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4
                          }}
                        >
                          CREATE LIST
                        </ButtonBase>
                      </td>
                    </tr>
                  </TableBody>
                </table>
              ) : viewType === 'list' ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                    style={{
                      marginBottom: 16,
                      maxWidth: 350,
                      marginLeft: 'auto'
                    }}
                  >
                    <InputLabel variant="standard">Sort By</InputLabel>
                    <Select
                      variant="standard"
                      value={listSort}
                      label="Sort By"
                      onChange={(e) => setListSort(e.target.value as any)}
                    >
                      {['Default', 'Points', 'Due Date', 'Newest'].map(
                        (order, i) => (
                          <MenuItem key={i} value={order.toLowerCase()}>
                            {order}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                  {sortTasks(listSort, project.tasks).map((task, i) => (
                    <BaseTask
                      showProgress
                      key={task.id}
                      style={{}}
                      project={project}
                      openFunc={() => setEditingTaskId(task.id)}
                      task={task}
                    />
                  ))}
                </div>
              ) : (
                <CalendarWeek />
              )}
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
          <CreateList onClose={() => setDialogOpen(false)} project={project} />
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
