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
  ListItemText
} from '@mui/material'
import { formatDueDate } from '../../utils/formatDueDate'
import { toDaysHHMMSS } from '../../utils/utils'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'
import Comment from '@mui/icons-material/Comment'
import List from '@mui/icons-material/List'
import { Transition, animated } from 'react-spring/renderprops'
import { TProject } from '../../types/project'
import { isBefore } from 'date-fns'
import { APISetSubtask } from '../../API/project'
import { makeStyles } from '@mui/styles'
import { SubtaskMap } from './SubtaskMap'
import { id } from '../../utils/utils'
import { useDroppable } from '@dnd-kit/core'
import DraggableAvatar from './DraggableAvatar'
import { taskDummyOpacity } from '../Project/Project'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SELECT_POMODORO_TASK, TOGGLE_TIMER } from '../../store/pomodoro'
import { SET_SUBTASK } from '../../store/projects'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import { useTaskColor } from '../../utils/color'
import { Description } from '../TextEditor/DescriptionEditor'
import { deleteTask } from '../../actions/task'

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

const useStyles = makeStyles(() => ({
  badgeColor: {
    backgroundColor: '#4caf50'
  },
  badge: {
    marginTop: 15,
    marginRight: 15
  },
  input: {
    cursor: 'inherit',
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0
  },
  play: {
    padding: 6,
    marginRight: 2,
    color: 'rgba(0, 0, 0, 0.54)'
  }
}))

export const BaseTask = memo(
  ({
    task,
    openFunc,
    project,
    isDragging,
    hidden,
    style,
    showProgress,
    isDraggingUser
  }: OwnProps) => {
    const [rightClickAnchorEl, setRightClickAnchorEl] =
      useState<null | EventTarget>(null)

    const dispatch = useAppDispatch()
    const { pomodoro } = useAppSelector((state) => ({
      pomodoro: state.pomodoro
    }))

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

    const classes = useStyles()

    const { setNodeRef } = useDroppable({
      id: /*'ASSIGNED|' + */ task.id,
      data: {
        type: 'assigned',
        accepts: ['user']
      }
    })

    const theme = useTheme()

    const border = '1px solid ' + theme.palette.divider

    const TimeIcon = isCurrentTask ? Pause : PlayArrow

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
              deleteTask(dispatch, task.id, project.id)
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
              classes={{
                colorSecondary: classes.badgeColor,
                badge: classes.badge
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
                      task.assignedTo.map((userId, i) => (
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
                  taskId={task.id}
                  onCheckbox={(newSub: TSubtask) => {
                    dispatch(
                      SET_SUBTASK({
                        taskId: task.id,
                        projectId: project.id,
                        id: newSub.id,
                        newSubtask: newSub
                      })
                    )
                    APISetSubtask({
                      projId: project.id,
                      taskId: task.id,
                      subtaskId: newSub.id,
                      info: { name: newSub.name, completed: newSub.completed }
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
                                      recurrance: undefined
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
                      className={classes.play}
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
                      style={{ marginRight: 8 }}
                      className={classes.play}
                      onClick={(e) => {
                        // eventually have it toggle icon based on current showSubtasks(same with comments)
                        e.stopPropagation()
                        setShowSubTasks(!showSubTasks)
                      }}
                    >
                      <List />
                    </IconButton>
                  )}
                  {task.timeWorkedOn !== 0 && (
                    <span
                      style={{
                        alignSelf: 'center',
                        fontSize: 13,
                        marginLeft: 6,
                        color: secondary
                      }}
                    >
                      Worked on for {toDaysHHMMSS(task.timeWorkedOn, true)}
                    </span>
                  )}
                  <TimeIcon
                    style={{
                      marginLeft: 'auto',
                      color: theme.palette.text.secondary
                    }}
                    className={classes.play}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (pomodoro.selectedTaskId !== task.id) {
                        dispatch(SELECT_POMODORO_TASK(task.id))
                      } else if (pomodoro.selectedTaskId === task.id) {
                        dispatch(TOGGLE_TIMER(Date.now()))
                      }
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
                  task.progress === 2
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
