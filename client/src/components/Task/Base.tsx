import { useState, useEffect, useRef, memo } from 'react'
import { TTask, TSubtask } from '../../types/project'
import {
  LinearProgress,
  Badge,
  IconButton,
  useTheme,
  MenuItem,
  Popover,
  ListItemIcon,
  ListItemText,
  Chip,
  Box
} from '@mui/material'
import { formatDueDate } from '../../utils/formatDueDate'
import { toDaysHHMMSS } from '../../utils/utils'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'
import Comment from '@mui/icons-material/Comment'
import List from '@mui/icons-material/List'
import { Transition, animated } from 'react-spring'
import { TProject } from '../../types/project'
import { isBefore } from 'date-fns'
import { SubtaskMap } from './SubtaskMap'
import { id } from '../../utils/utils'
import { useDroppable } from '@dnd-kit/core'
import DraggableAvatar from './DraggableAvatar'
import { taskDummyOpacity } from '../Project/Project'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SELECT_POMODORO_TASK, TOGGLE_TIMER } from '../../store/pomodoro'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import { useTaskColor } from '../../utils/color'
import { Description } from '../TextEditor/DescriptionEditor'
import { useDeleteTaskMutation } from '../../store/api'
import { useSetSubtaskMutation } from '../../store/api'
import { ApiTask } from '@shared/types'

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(undefined as any)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  })

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return
  }, [delay])
}

interface OwnProps {
  project: TProject
  isDragging?: boolean
  task: TTask
  hidden?: boolean
  openFunc(): void
  showProgress?: boolean
  isDraggingUser?: boolean
  style?: any
}

const getProgress = (id: string, project: TProject) => {
  for (let i = 0; i < project.lists.length; i++) {
    for (let j = 0; j < project.lists[i].taskIds.length; j++) {
      if (project.lists[i].taskIds[j].includes(id)) {
        return j
      }
    }
  }

  return 0
}
// Helper component to render time estimate info
const TimeEstimateDisplay = ({ task }: { task: ApiTask }) => {
  const {
    timeEstimateValue,
    timeEstimateLowPercentile,
    timeEstimateHighPercentile,
    timeEstimateLowValue,
    timeEstimateHighValue
  } = task

  if (!timeEstimateValue) return null

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
      <Chip
        label={`${timeEstimateValue}hr`}
        size="small"
        variant="filled"
        sx={{
          fontSize: '0.7rem',
          height: 20,
          color: 'text.secondary',
          borderColor: 'divider'
        }}
      />
      {timeEstimateLowValue ? (
        <Chip
          label={`${timeEstimateLowValue}hr p${timeEstimateLowPercentile}`}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.7rem',
            height: 20,
            color: 'text.secondary',
            borderColor: 'divider'
          }}
        />
      ) : null}
      {timeEstimateHighValue ? (
        <Chip
          label={`${timeEstimateHighValue}hr p${timeEstimateHighPercentile}`}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.7rem',
            height: 20,
            color: 'text.secondary',
            borderColor: 'divider'
          }}
        />
      ) : null}
    </Box>
  )
}

export const BaseTask = memo(
  ({
    task,
    openFunc,
    project,
    isDragging,
    hidden,
    style,
    showProgress
  }: OwnProps) => {
    const [deleteTaskMutation] = useDeleteTaskMutation()
    const [setSubtaskMutation] = useSetSubtaskMutation()

    const [rightClickAnchorEl, setRightClickAnchorEl] =
      useState<null | EventTarget>(null)

    const dispatch = useAppDispatch()
    const pomodoro = useAppSelector((state) => state.pomodoro)

    const { backgroundColor, textColor, secondary } = useTaskColor(task.color)
    const finalTextColor = isDragging ? secondary : textColor

    const isCurrentTask = pomodoro.selectedTaskId === task.id.toString()

    const [showComments, setShowComments] = useState(false)
    const [showSubTasks, setShowSubTasks] = useState(true)

    const [formatDate, setFormatDate] = useState(formatDueDate(task))

    if (formatDueDate(task) !== formatDate) {
      setFormatDate(formatDueDate(task))
    }
    useInterval(() => {
      if (task.dueDate) {
        setFormatDate(formatDueDate(task))
      }
    }, 1000)

    const MIN_HEIGHT = 20

    const { setNodeRef } = useDroppable({
      id: /*'ASSIGNED|' + */ task.id,
      data: {
        type: 'assigned',
        accepts: ['user']
      }
    })

    const theme = useTheme()

    const border = '1px solid ' + theme.palette.divider

    const TimeIcon = isCurrentTask && !pomodoro.isPaused ? Pause : PlayArrow

    if (!task) {
      return null
    }

    return (
      <>
        <Popover
          anchorEl={rightClickAnchorEl ? (rightClickAnchorEl as any).el : null}
          open={Boolean(rightClickAnchorEl)}
          anchorReference="anchorPosition"
          anchorPosition={
            rightClickAnchorEl
              ? {
                  top: (rightClickAnchorEl as any).top,
                  left: (rightClickAnchorEl as any).left
                }
              : undefined
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          onClose={() => setRightClickAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              setRightClickAnchorEl(null)
              openFunc()
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Task</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setRightClickAnchorEl(null)
              deleteTaskMutation({
                id: task.id,
                projId: project.id
              })
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Popover>
        <div style={{ width: '100%' }}>
          <div
            onContextMenu={(e) => {
              e.preventDefault()

              e.stopPropagation() // parents (Cell) have contextMenu watchers too, don't call both
              setRightClickAnchorEl({
                el: e.currentTarget,
                top: e.clientY,
                left: e.clientX
              } as any)
            }}
            className="task"
            ref={setNodeRef}
            id={task.id.toString()}
            style={{
              display: hidden ? 'none' : undefined,
              minHeight: MIN_HEIGHT,
              backgroundColor,
              backgroundImage:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                  : undefined,
              border,
              cursor: 'pointer',
              color: secondary,
              opacity: isDragging ? taskDummyOpacity : undefined,
              outline: 'none',
              ...(style || {})
            }}
            onClick={() => {
              if (pomodoro.selectingTask) {
                dispatch(SELECT_POMODORO_TASK(task.id.toString()))
              } else {
                openFunc()
              }
            }}
          >
            <Badge
              sx={{
                '& .MuiBadge-colorSecondary': {
                  backgroundColor: '#4caf50'
                },
                '& .MuiBadge-badge': {
                  marginTop: 2,
                  marginRight: 2
                }
              }}
              color={'primary'}
              badgeContent={task.points}
              style={{
                width: '100%',
                display: 'flex',
                minHeight: MIN_HEIGHT,
                outline: 'none'
              }}
            >
              <div style={{ margin: 4, width: '100%', display: 'block' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showProgress && (
                    <CheckCircleOutline
                      style={{
                        marginLeft: 4,
                        color: [
                          undefined,
                          theme.palette.warning.main,
                          theme.palette.success.main
                        ][getProgress(task.id, project)]
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: 'flex'
                    }}
                  >
                    {task.assignedTo &&
                      task.assignedTo.map((userId) => (
                        <DraggableAvatar
                          noMargin
                          key={userId}
                          task={task}
                          user={project.users[id(project.users, userId)]}
                        />
                      ))}
                  </div>
                  <span
                    id={task.id}
                    style={{
                      fontSize: 18,
                      maxWidth: '94%',
                      color: finalTextColor,
                      marginLeft: 4,
                      marginTop: 4
                    }}
                  >
                    <div style={{ display: 'flex', userSelect: 'none' }}>
                      {task.name ? task.name : 'Unnamed Task'}
                    </div>
                  </span>
                </div>

                {/* Time Estimate Display */}
                <TimeEstimateDisplay task={task} />

                {task.description && (
                  <div style={{ marginTop: 4, marginLeft: 4 }}>
                    <Description
                      color={secondary}
                      description={task.description}
                      readOnly
                      onChange={() => null}
                    />
                  </div>
                )}
                <SubtaskMap
                  show={showSubTasks}
                  subTasks={task.subTasks}
                  onCheckbox={(newSub: TSubtask) => {
                    setSubtaskMutation({
                      projId: project.id,
                      taskId: task.id,
                      subtaskId: newSub.id,
                      info: {
                        name: newSub.name,
                        completed: newSub.completed
                      }
                    })
                  }}
                />

                {task.comments.length !== 0 && (
                  <Transition
                    initial={null}
                    items={showComments}
                    from={{ height: 0, overflow: 'hidden' }}
                    enter={{ height: 'auto' }}
                    leave={{ height: 0, overflow: 'hidden' }}
                  >
                    {(show) =>
                      show &&
                      ((style) => (
                        <animated.div style={{ marginLeft: 6, ...style }}>
                          <div
                            style={{
                              paddingTop: 10,
                              paddingBottom: 10,
                              borderRadius: '.8rem'
                            }}
                          >
                            {task.comments.map((comment) => (
                              <div
                                key={comment.id}
                                style={{ color: theme.palette.text.primary }}
                              >
                                <span
                                  style={{
                                    color: theme.palette.text.secondary
                                  }}
                                >
                                  {
                                    formatDueDate({
                                      ...task,
                                      dueDate: comment.dateAdded,
                                      recurrenceInterval: null
                                    }).split('Due')[1]
                                  }
                                </span>
                                {'  -  '}
                                {comment.comment}
                              </div>
                            ))}
                          </div>
                        </animated.div>
                      ))
                    }
                  </Transition>
                )}
                {task.dueDate && getProgress(task.id, project) !== 2 && (
                  <>
                    <div
                      style={{
                        marginLeft: 6,
                        color: isBefore(new Date(task.dueDate), new Date())
                          ? '#d32f24'
                          : theme.palette.text.primary
                      }}
                    >
                      {formatDate}
                    </div>
                  </>
                )}
                <div
                  style={{
                    display: 'flex',
                    cursor: 'pointer'
                  }}
                >
                  {Object.values(task.comments).length !== 0 && (
                    <IconButton
                      aria-label="show comments"
                      sx={{
                        padding: 0.75,
                        marginRight: 0.25,
                        color: 'rgba(0, 0, 0, 0.54)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowComments(!showComments)
                      }}
                    >
                      <Comment />
                    </IconButton>
                  )}
                  {Object.values(task.subTasks).length !== 0 && (
                    <IconButton
                      aria-label="show subtasks"
                      sx={{
                        padding: 0.75,
                        marginRight: 1,
                        color: 'rgba(0, 0, 0, 0.54)'
                      }}
                      onClick={(e) => {
                        // eventually have it toggle icon based on current showSubtasks(same with comments)
                        e.stopPropagation()
                        setShowSubTasks(!showSubTasks)
                      }}
                    >
                      <List />
                    </IconButton>
                  )}
                  {task.workedOnMs ? (
                    <span
                      style={{
                        alignSelf: 'center',
                        fontSize: 13,
                        marginLeft: 6,
                        color: secondary
                      }}
                    >
                      Worked on for{' '}
                      {toDaysHHMMSS(Math.floor(task.workedOnMs / 1000), true)}
                    </span>
                  ) : null}
                  <TimeIcon
                    style={{
                      marginLeft: 'auto',
                      color: theme.palette.text.secondary,
                      padding: 6,
                      marginRight: 2,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (pomodoro.selectedTaskId !== task.id) {
                        dispatch(SELECT_POMODORO_TASK(task.id))
                      }

                      dispatch(TOGGLE_TIMER())
                    }}
                  />
                </div>
              </div>
            </Badge>
            {task.subTasks.length !== 0 && (
              <LinearProgress
                aria-label="subtasks"
                style={{
                  borderRadius: 0
                }}
                variant="determinate"
                color="primary"
                value={
                  getProgress(task.id, project) === 2
                    ? 100
                    : (task.subTasks.filter((subTask) => subTask.completed)
                        .length /
                        task.subTasks.length) *
                      100
                }
              />
            )}
          </div>
        </div>
      </>
    )
  }
)
