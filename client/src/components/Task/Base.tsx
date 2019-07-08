import React, { useState, useEffect, useRef } from 'react'
import { TTask, TSubtasks } from '../../types/task'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { selectPomodoroTaskA, toggleTimerA } from '../../store/actions/pomodoro'
import {
  LinearProgress,
  Badge,
  createStyles,
  WithStyles,
  withStyles,
  Chip,
  IconButton,
  Tooltip
} from '@material-ui/core'
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'
import { formatDueDate } from '../../utils/formatDueDate'
import { toDaysHHMMSS } from '../../utils/convertToTime'
import {
  CheckBox,
  CheckBoxOutlineBlankOutlined,
  PlayArrow,
  Pause,
  Comment,
  List
} from '@material-ui/icons'
import { hasPassed } from '../../utils/hasPassed'
import { Transition, animated } from 'react-spring/renderprops'
import { TProject } from '../../types/project'
import { selectMemberA } from '../../store/actions/project'

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

export const SubtaskMap = ({
  subTasks,
  onCheckbox,
  taskId,
  show
}: {
  subTasks: TSubtasks
  onCheckbox: (subId: string) => void
  taskId: string
  show: boolean
}) => (
  <div style={{ marginLeft: 30 }}>
    <Transition
      initial={null}
      native
      items={show ? subTasks.filter(subTask => !subTask.completed) : []}
      keys={
        show
          ? subTasks
              .filter(subTask => !subTask.completed)
              .map(subTask => subTask.id)
          : []
      }
      from={{ opacity: 1, height: 0, overflow: 'hidden' }}
      enter={{ opacity: 1, height: 'auto' }}
      leave={{ opacity: 0, height: 0, overflow: 'hidden' }}
    >
      {subTask => props => (
        <animated.div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...props
          }}
        >
          <div
            style={{
              marginTop: 6
            }}
          >
            {subTask.completed ? (
              <CheckBox
                onClick={e => {
                  e.stopPropagation()
                  onCheckbox(subTask.id)
                }}
              />
            ) : (
              <CheckBoxOutlineBlankOutlined
                onClick={e => {
                  e.stopPropagation()
                  onCheckbox(subTask.id)
                }}
              />
            )}
          </div>
          <span style={{ marginLeft: 8 }}>{subTask.name}</span>
        </animated.div>
      )}
    </Transition>
  </div>
)

interface OwnProps {
  dense?: boolean
  bulky?: boolean
  project: TProject
  task: TTask
  projectName?: string
  isCompletedColumn?: boolean
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  margined?: boolean
  openFunc(): void
}

const styles = () =>
  createStyles({
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
  })

type TaskProps = OwnProps &
  ReturnType<typeof mapState> &
  typeof actionCreators &
  WithStyles<typeof styles>

const CBaseTask = (props: TaskProps) => {
  const onClickCheckbox = (e: any) => {
    e.stopPropagation()
    // props.toggleCompleteTask(props.task.id, props.project.id)
  }

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

  const {
    task,
    isSelectingTask,
    provided,
    snapshot,
    openFunc,
    bulky,
    dense,
    project,
    projectName
  } = props
  const MIN_HEIGHT = dense ? 10 : bulky ? 40 : 20

  const border = '1px solid rgba(0, 0, 0, 0.12)'
  return task ? (
    <div style={{ width: '100%' }}>
      <div
        id={task.id.toString()}
        ref={provided ? provided.innerRef : undefined}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          minHeight: MIN_HEIGHT,
          backgroundColor: task.color ? task.color : 'white',
          border,
          borderBottom: task.subTasks.length ? 'none' : 'border',
          ...provided.draggableProps.style,
          color: snapshot ? (snapshot.isDragging ? 'gray' : 'black') : 'black',
          outline: 'none',
          margin: props.margined ? 6 : 0
        }}
        onClick={() => {
          if (project && project.selectingMember) {
            props.stopSelectingMember({
              id: project.selectingMember,
              projectId: project.id
            })
          } else if (isSelectingTask) {
            props.selectPomodoroTask(task.id.toString())
          } else {
            openFunc()
          }
        }}
      >
        <Badge
          classes={{
            colorSecondary: props.classes.badgeColor,
            badge: props.classes.badge
          }}
          color={!task.completed ? 'primary' : 'secondary'}
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
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 4
                }}
              >
                {task.completed ? (
                  <CheckBox onClick={onClickCheckbox} />
                ) : (
                  <CheckBoxOutlineBlankOutlined onClick={onClickCheckbox} />
                )}
              </div>
              <span
                id={task.id}
                style={{
                  fontSize: 18,
                  color: hasPassed(task.dueDate) ? '#d32f24' : 'black',
                  marginLeft: 8
                }}
              >
                <div style={{ display: 'flex' }}>
                  {task.assignedUsers.map(userId => {
                    const profile = project ? project.users[userId] : undefined
                    return (
                      profile && (
                        <Tooltip key={userId} title={profile.username}>
                          <img
                            src={profile.profileImg}
                            style={{
                              marginRight: 8,
                              borderRadius: '50%',
                              height: 40,
                              width: 40
                            }}
                          />
                        </Tooltip>
                      )
                    )
                  })}
                  {task.name ? task.name : 'Unnamed Task'}
                </div>
                {bulky && projectName && (
                  <div style={{ fontSize: 15, color: '#4f4f4f' }}>
                    {projectName}
                  </div>
                )}
              </span>
            </div>
            {task.tags.map(tagId => {
              const tag = project.tags[tagId]
              if (tag) {
                return (
                  <Chip
                    variant="outlined"
                    key={tagId}
                    label={tag.name}
                    style={{
                      backgroundColor: tag.color,
                      height: 24,
                      margin: '0px 4px'
                    }}
                  />
                )
              }
              return null
            })}
            {!dense && (
              <SubtaskMap
                show={showSubTasks}
                subTasks={task.subTasks}
                taskId={task.id}
                onCheckbox={(subId: string) => {
                  console.log('SUBTASK COMPLETE NOT IMPLEMENTED BY APOLLO YET')
                  // props.completeSubTask(task.id, project.id, subId)
                }}
              />
            )}
            {!dense && task.comments.length !== 0 && (
              <Transition
                initial={null}
                items={showComments}
                from={{ height: 0, overflow: 'hidden' }}
                enter={{ height: 'auto' }}
                leave={{ height: 0, overflow: 'hidden' }}
              >
                {show =>
                  show &&
                  (style => (
                    <animated.div style={{ marginLeft: 6, ...style }}>
                      <div
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                          borderRadius: '.8rem'
                        }}
                      >
                        {task.comments.map(comment => (
                          <div key={comment.id} style={{ color: 'black' }}>
                            <span style={{ color: 'rgba(0, 0, 0, 0.70)' }}>
                              {
                                formatDueDate(
                                  {
                                    ...task,
                                    startDate: undefined,
                                    dueDate: comment.dateAdded,
                                    recurrance: undefined
                                  },
                                  false
                                ).split('Due')[1]
                              }
                            </span>
                            {'  -  '}
                            {comment.description}
                          </div>
                        ))}
                      </div>
                    </animated.div>
                  ))
                }
              </Transition>
            )}
            {task.dueDate && (
              <>
                <div style={{ marginLeft: 6 }}>{formatDate}</div>
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
                  className={props.classes.play}
                  onClick={e => {
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
                  className={props.classes.play}
                  onClick={e => {
                    // eventually have it toggle icon based on current showSubtasks(same with comments)
                    e.stopPropagation()
                    setShowSubTasks(!showSubTasks)
                  }}
                >
                  <List />
                </IconButton>
              )}
              {task.timeWorkedOn !== 0 && (
                <span style={{ alignSelf: 'center' }}>
                  Worked on for {toDaysHHMMSS(task.timeWorkedOn, true)}
                </span>
              )}
              {!props.isCurrentTask ? (
                <PlayArrow
                  style={{ marginLeft: 'auto' }}
                  className={props.classes.play}
                  onClick={e => {
                    e.stopPropagation()
                    props.selectPomodoroTask(task.id)
                    props.toggleTimer()
                  }}
                />
              ) : (
                <Pause
                  style={{ marginLeft: 'auto' }}
                  className={props.classes.play}
                  onClick={e => {
                    e.stopPropagation()
                    props.selectPomodoroTask(task.id)
                    props.toggleTimer()
                  }}
                />
              )}
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
              task.completed
                ? 100
                : (task.subTasks.filter(subTask => subTask.completed).length /
                    task.subTasks.length) *
                  100
            }
          />
        )}
      </div>
    </div>
  ) : null
}

const mapState = (state: TState, ownProps: OwnProps) => ({
  isSelectingTask: state.pomodoro.selectingTask,
  isCurrentTask: state.pomodoro.selectedTaskId === ownProps.task.id.toString(),
  pomodoro: state.pomodoro
})

const actionCreators = {
  selectPomodoroTask: selectPomodoroTaskA,
  stopSelectingMember: selectMemberA,
  toggleTimer: toggleTimerA,
  selectMember: selectMemberA
}

export const BaseTask = withStyles(styles)(
  connect(
    mapState,
    actionCreators
  )(CBaseTask)
)
