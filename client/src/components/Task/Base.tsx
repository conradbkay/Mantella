import { useState, useEffect, useRef, memo } from 'react'
import { TTask, TSubtask } from '../../types/project'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { selectPomodoroTaskA, toggleTimerA } from '../../store/actions/pomodoro'
import { LinearProgress, Badge, IconButton, useTheme } from '@mui/material'
import { formatDueDate } from '../../utils/formatDueDate'
import { toDaysHHMMSS } from '../../utils/utilities'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Pause from '@mui/icons-material/Pause'
import Comment from '@mui/icons-material/Comment'
import List from '@mui/icons-material/List'
import { Transition, animated } from 'react-spring/renderprops'
import { TProject } from '../../types/project'
import { selectMemberA } from '../../store/actions/project'
import { setSubtaskA } from '../../store/actions/task'
import { isBefore } from 'date-fns'
import { APISetSubtask } from '../../API/project'
import { Editor } from 'draft-js'
import { getEditorStateFromTaskDescription } from './getEditorState'
import { makeStyles } from '@mui/styles'
import { SubtaskMap } from './SubtaskMap'
import { id } from '../../utils/utilities'
import { useDroppable } from '@dnd-kit/core'
import DraggableAvatar from './DraggableAvatar'
import { taskDummyOpacity } from '../Project/Project'

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
  isDraggingUser?: boolean
  style?: any
}

const useStyles = makeStyles(() => ({
  badgeColor: {
    backgroundColor: '#4caf50'
  },
  badge: {
    marginTop: 15,
    marginRight: 15
    // position: 'relative'
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

type ActionCreators = typeof actionCreators
interface TaskProps
  extends OwnProps,
    ReturnType<typeof mapState>,
    ActionCreators {}

const CBaseTask = memo((props: TaskProps) => {
  const [showComments, setShowComments] = useState(false)
  const [showSubTasks, setShowSubTasks] = useState(true)

  const [formatDate, setFormatDate] = useState(formatDueDate(props.task, true))

  if (formatDueDate(props.task, true) !== formatDate) {
    setFormatDate(formatDueDate(props.task, true))
  }
  useInterval(() => {
    if (props.task.dueDate) {
      setFormatDate(formatDueDate(props.task, true))
    }
  }, 1000)

  const { task, isSelectingTask, openFunc } = props
  const MIN_HEIGHT = 20

  const classes = useStyles()

  // TODO: don't use if isn't a draggable Task already
  const { setNodeRef } = useDroppable({
    id: /*'ASSIGNED|' + */ task.id,
    data: {
      type: 'assigned',
      accepts: ['user']
    }
  })

  const theme = useTheme()

  const border = '1px solid ' + theme.palette.divider

  const TimeIcon = props.isCurrentTask ? Pause : PlayArrow

  return task ? (
    <div style={{ width: '100%' }}>
      <div
        ref={setNodeRef}
        id={task.id.toString()}
        style={{
          display: props.hidden ? 'none' : undefined,
          minHeight: MIN_HEIGHT,
          backgroundColor:
            task.color && task.color !== '#FFFFFF'
              ? task.color
              : theme.palette.background.paper,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
              : undefined,
          border,
          cursor: 'pointer',
          color: props.isDragging
            ? theme.palette.text.disabled
            : theme.palette.text.secondary,
          opacity: props.isDragging ? taskDummyOpacity : undefined,
          outline: 'none',
          ...(props.style || {})
        }}
        onClick={() => {
          if (isSelectingTask) {
            props.selectPomodoroTask(task.id.toString())
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
              <span
                id={task.id}
                style={{
                  fontSize: 18,
                  maxWidth: '94%',
                  color: props.isDragging
                    ? theme.palette.text.disabled
                    : theme.palette.text.secondary,
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
                <Editor
                  editorState={getEditorStateFromTaskDescription(
                    task.description
                  )}
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
                props.setSubtask({
                  taskId: task.id,
                  projectId: props.project.id,
                  id: newSub.id,
                  newSubtask: newSub
                })
                APISetSubtask({
                  projId: props.project.id,
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
                              style={{ color: theme.palette.text.secondary }}
                            >
                              {
                                formatDueDate(
                                  {
                                    ...task,
                                    dueDate: comment.dateAdded,
                                    recurrance: undefined
                                  },
                                  false
                                ).split('Due')[1]
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
            {task.dueDate && task.progress !== 2 && (
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
              <div
                style={{
                  display: 'flex'
                }}
              >
                {task.assignedTo &&
                  task.assignedTo.map((userId, i) => (
                    <DraggableAvatar
                      key={userId}
                      task={task}
                      user={
                        props.project.users[id(props.project.users, userId)]
                      }
                    />
                  ))}
              </div>
              {Object.values(task.comments).length !== 0 && (
                <IconButton
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
                  style={{ alignSelf: 'center', fontSize: 13, marginLeft: 6 }}
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
                  props.selectPomodoroTask(task.id)
                  props.toggleTimer()
                }}
              />
            </div>
          </div>
        </Badge>
        {task.subTasks.length !== 0 && (
          <LinearProgress
            style={{
              borderRadius: 0
            }}
            variant="determinate"
            color="secondary"
            value={
              task.progress === 2
                ? 100
                : (task.subTasks.filter((subTask) => subTask.completed).length /
                    task.subTasks.length) *
                  100
            }
          />
        )}
      </div>
    </div>
  ) : null
})

const mapState = (state: TState, ownProps: OwnProps) => ({
  isSelectingTask: state.pomodoro.selectingTask,
  isCurrentTask: state.pomodoro.selectedTaskId === ownProps.task.id.toString(),
  pomodoro: state.pomodoro
})

const actionCreators = {
  selectPomodoroTask: selectPomodoroTaskA,
  stopSelectingMember: selectMemberA,
  toggleTimer: toggleTimerA,
  selectMember: selectMemberA,
  setSubtask: setSubtaskA
}

export const BaseTask = connect(mapState, actionCreators)(CBaseTask)