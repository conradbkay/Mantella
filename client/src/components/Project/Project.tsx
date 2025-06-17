import { memo, useMemo, useState } from 'react'
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
  ButtonBase,
  useMediaQuery
} from '@mui/material'
import { CreateList } from './CreateList'
import Add from '@mui/icons-material/Add'
import Create from '@mui/icons-material/Create'
import { NoMatch } from '../404/NoMatch'
import Helmet from 'react-helmet'
import { ProjectCell } from './Cell'
import { CreateTask } from '../Task/Create'
import { EditTaskModal } from '../Task/Edit'
import Color from 'color'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import {
  rectIntersection,
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
import { Sidebar } from './Sidebar'
import { CalendarWeek } from '../Calendar/Week'
import { TList, TTask } from '../../types/project'
import { Scrollbar } from 'react-scrollbars-custom'
import { filterTask } from '../../utils/filterTasks'
import useTitle from '../useTitle'
import {
  useDeleteTaskMutation,
  useDragTaskMutation,
  useGetProjectsQuery,
  api
} from '../../store/api'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import {
  getDragEventData,
  dragTask as dragTaskUtil
} from '../../utils/dragTask'

/**
 * @todo add a filter menu with color, column, due date, label
 */

const sortTasks = (sortType: string, tasks: TTask[]) => {
  if (sortType === 'default') {
    return tasks
  }

  return [...tasks].sort((a, b) => {
    if (sortType === 'points') {
      return (b.points || 0) - (a.points || 0)
    } else if (sortType === 'due date') {
      // overdue, then due, then no date date
      return (
        (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
        (b.dueDate ? new Date(b.dueDate).getTime() : Infinity)
      )
    } else {
      return (
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
      )
    }
  })
}

type Props = {
  params: {
    id: string
  }
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

// necessary to allow clicking AND dragging tasks
export class MyPointerSensor extends PointerSensor {
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
  return rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter(
      ({ id }: any) => id !== 'trash'
    )
  })
}

export const Project = memo((props: Props) => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draggingId, setDraggingId] = useState(null as string | null)
  const [overTrash, setOverTrash] = useState(false)

  const isMobile = useMediaQuery('(max-width: 500px)')

  const [viewType, setViewType] = useState<
    'kanban' | 'lists' | 'calendar' | 'tasks'
  >(isMobile ? 'lists' : 'kanban')
  const [listSort, setListSort] = useState<
    'default' | 'points' | 'due date' | 'newest'
  >('default')

  const [creating, setCreating] = useState('')
  const [fab, setFab] = useState(false)

  const { data: projects } = useGetProjectsQuery()
  const filter = useAppSelector((state) => state.filter)
  const dispatch = useAppDispatch()

  const project = useMemo(
    () => projects?.find((p) => p.id === props.params.id),
    [projects, props.params.id]
  )

  useTitle(project ? project.name : 'Project')

  const [dragTask] = useDragTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()

  const onDragStart = (event: DragStartEvent) => {
    if ((event.active.id as any).slice(0, 4) === 'user') {
    } else {
      setDraggingId(event.active.id as string)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    if (event.over && event.over.id === 'trash') {
      if (!overTrash) {
        setOverTrash(true)
      }
    } else {
      // Reset trash state when not over trash
      setOverTrash(false)

      if (draggingId && event.over && project) {
        const dragData = getDragEventData(event)
        if (dragData) {
          // Only do optimistic update for visual feedback, no API call
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const projectIndex = draft.findIndex((p) => p.id === project.id)
              if (projectIndex !== -1) {
                const proj = draft[projectIndex]
                dragTaskUtil({
                  project: proj,
                  ...dragData
                })
              }
            })
          )
        }
      }
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    if (!project) return

    if (event.over && event.over.id === 'trash') {
      deleteTask({ id: draggingId!, projId: project.id })
    } else if (draggingId && event.over) {
      // Handle task drag and drop - make API call to persist
      const dragData = getDragEventData(event)
      if (dragData) {
        dragTask({
          projectId: project.id,
          ...dragData
        })
      }
    }

    // todo there's a bunch of logic to implement from old Project.tsx for dropping user onto task. Maybe we should simplify all the dnd code first though, get rid of weird splliting by |

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
            isMobile={isMobile}
            setViewType={(newType: string) => {
              setViewType(newType as any)
            }}
            viewType={viewType}
            deleteMode={draggingId !== null}
            project={project}
          />
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 124px)' }}>
            <Sidebar project={project} />
            <Scrollbar style={{ height: 'inherit', width: '100%' }}>
              <Paper
                style={{
                  margin: isMobile ? 0 : 16,
                  padding: '16px 20px',
                  minHeight: 'calc(100vh - 328px)'
                }}
              >
                {viewType === 'kanban' || viewType === 'lists' ? (
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      tableLayout: 'fixed'
                    }}
                  >
                    <TableBody>
                      {viewType === 'kanban' && (
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
                      )}
                      {project.lists.map((list: TList) => (
                        <tr
                          style={{
                            display: 'flex',
                            flexDirection:
                              viewType === 'lists' ? 'column' : 'row'
                          }}
                          key={list.id}
                        >
                          {[0, 1, 2].map((progress) =>
                            progress === 0 || viewType === 'kanban' ? (
                              <ProjectCell
                                viewType={viewType}
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
                            ) : null
                          )}
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
                ) : viewType === 'tasks' ? (
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
                        <MenuItem value={'default'}>Default</MenuItem>
                        <MenuItem value={'due date'}>Due Date</MenuItem>
                        <MenuItem value={'newest'}>Newest</MenuItem>
                        <MenuItem value={'points'}>Points</MenuItem>
                      </Select>
                    </FormControl>
                    {sortTasks(
                      listSort,
                      project.tasks.filter((task) => filterTask(task, filter))
                    ).map((task) => (
                      <BaseTask
                        key={task.id}
                        openFunc={() => setEditingTaskId(task.id)}
                        project={project}
                        task={task}
                      />
                    ))}
                  </div>
                ) : (
                  <CalendarWeek project={project} />
                )}
              </Paper>
            </Scrollbar>
          </div>
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {draggingId && (
              <BaseTask
                isDragging
                openFunc={() => null}
                project={project}
                task={project.tasks.find((task) => task.id === draggingId)!}
              />
            )}
          </DragOverlay>

          <CreateList
            onClose={() => setDialogOpen(false)}
            open={dialogOpen}
            projectId={project.id}
          />
          {editingTaskId && (
            <EditTaskModal
              onClose={() => setEditingTaskId('')}
              taskId={editingTaskId}
              projectId={project.id}
            />
          )}
          {creating && (
            <CreateTask
              onClose={() => setCreating('')}
              listId={creating}
              projectId={project.id}
            />
          )}
          <SpeedDial
            style={{
              position: 'fixed',
              bottom: 16,
              right: 16
            }}
            onOpen={() => setFab(true)}
            onClose={() => setFab(false)}
            open={fab}
            ariaLabel="SpeedDial basic example"
            icon={<Add />}
          >
            <SpeedDialAction
              onClick={() => setCreating(project.lists[0].id)}
              icon={<Create />}
              tooltipTitle="Create Task"
            />
            <SpeedDialAction
              onClick={() => setDialogOpen(true)}
              icon={<Add />}
              tooltipTitle="Create List"
            />
          </SpeedDial>
        </DndContext>
      </>
    )
  } else {
    // TODO: skeletons
    return <NoMatch />
  }
})
