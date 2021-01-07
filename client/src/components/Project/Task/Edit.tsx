import React, { useState } from 'react'
import {
  Dialog,
  TextField,
  Button,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Checkbox,
  IconButton
} from '@material-ui/core'
import uuid from 'uuid'
import { connect } from 'react-redux'
import { TState } from '../../../types/state'
import { id, getAllListsArr } from '../../../utils/utilities'
import {
  GQL_EDIT_TASK,
  GQL_DRAG_TASK,
  GQL_SET_SUBTASK,
  GQL_SET_COMMENT
} from '../../../graphql/mutations/task'
import { useMutation } from 'react-apollo'

import {
  EditTaskMutation,
  EditTaskMutationVariables,
  DragTaskMutation,
  DragTaskMutationVariables,
  SetSubtaskMutation,
  SetSubtaskMutationVariables,
  SetCommentMutation,
  SetCommentMutationVariables
} from '../../../graphql/types'
import { setTaskA } from '../../../store/actions/task'
import { ChooseColor } from '../../utils/chooseColor'
import { setProjectA } from '../../../store/actions/project'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import { Add, Delete } from '@material-ui/icons'
import { formatDueDate } from '../../../utils/formatDueDate'
import { cloneDeep } from 'lodash'

const mapState = (state: TState, ownProps: OwnProps) => {
  const project = state.projects[id(state.projects, ownProps.projectId)]

  return {
    task: project.tasks[id(project.tasks, ownProps.taskId)],
    projects: state.projects
  }
}

const actionCreators = {
  setTask: setTaskA,
  setProject: setProjectA
}

type OwnProps = {
  onClose: () => void
  taskId: string
  projectId: string
}

type TProps = OwnProps & ReturnType<typeof mapState> & typeof actionCreators

export const EditTaskModal = connect(
  mapState,
  actionCreators
)((props: TProps) => {
  // apply changes locally (not in store) immediately, then when submit do on store and server
  const [task, setTask] = useState(cloneDeep(props.task))

  const [setSubtaskExec] = useMutation<
    SetSubtaskMutation,
    SetSubtaskMutationVariables
  >(GQL_SET_SUBTASK, {
    onCompleted: ({ setSubtask }) => {
      props.setTask({
        id: setSubtask.id,
        projectId: props.projectId,
        newTask: { ...setSubtask }
      })
    }
  })

  const [setCommentExec] = useMutation<
    SetCommentMutation,
    SetCommentMutationVariables
  >(GQL_SET_COMMENT, {
    onCompleted: ({ setComment }) => {
      setTask({
        ...setComment
      })

      props.setTask({
        id: setComment.id,
        projectId: props.projectId,
        newTask: { ...setComment }
      })
    }
  })

  const [editTaskExec] = useMutation<
    EditTaskMutation,
    EditTaskMutationVariables
  >(GQL_EDIT_TASK, {
    variables: {
      taskId: props.taskId,
      newTask: {
        name: task.name,
        points: task.points,
        dueDate: task.dueDate,
        color: task.color,
        description: task.description
      },
      projId: props.projectId
    }
  })
  const [dragTaskExec] = useMutation<
    DragTaskMutation,
    DragTaskMutationVariables
  >(GQL_DRAG_TASK, {
    onCompleted: ({ dragTask }) => {
      props.setProject({ id: dragTask.project.id, newProj: dragTask.project })
    }
  })

  const project = props.projects[id(props.projects, props.projectId)]

  const ownerListId = project.lists.find((list) =>
    list.taskIds.includes(task.id)
  )!.id

  const [listId, setListId] = useState(ownerListId)

  return (
    <div>
      <Dialog open onClose={() => props.onClose()}>
        <form
          onSubmit={(e) => {
            props.setTask({
              id: props.task.id,
              projectId: props.projectId,
              newTask: task
            })

            console.log(task)

            editTaskExec()
            if (listId !== ownerListId) {
              let newIndex = 0

              const tasksInNewProgress = project.tasks.filter((filterTask) => {
                return (
                  project.lists[id(project.lists, listId)].taskIds.includes(
                    task.id
                  ) && task.progress === filterTask.progress
                )
              })

              if (tasksInNewProgress.length) {
                const indexesInList = tasksInNewProgress.map((tasko) => {
                  return project.lists[
                    id(project.lists, listId)
                  ].taskIds.indexOf(tasko.id)
                })
                const lowest = Math.min(...indexesInList)
                newIndex = lowest
              }

              dragTaskExec({
                variables: {
                  oldListId: ownerListId,
                  newListId: listId,
                  newIndex, // this is only correct in first progress
                  id: task.id,
                  newProgress: task.progress,
                  projectId: props.projectId
                }
              })
            }
            e.preventDefault()
            props.onClose()
          }}
          style={{
            minWidth: 550,
            minHeight: 450,
            padding: '0px 16px',
            paddingBottom: 12
          }}
        >
          <DialogTitle style={{ paddingLeft: '0px' }}>Edit Task</DialogTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '0 0 auto'
            }}
          >
            <TextField
              style={{ margin: '0 4px' }}
              required
              autoFocus
              variant="outlined"
              color="secondary"
              label="Title"
              value={task.name}
              onChange={({ target }) =>
                setTask({ ...task, name: target.value })
              }
              fullWidth
            />
            <TextField
              style={{ margin: '0 4px', width: '33%' }}
              required
              fullWidth
              variant="outlined"
              label="Points"
              value={task.points}
              type="number"
              onChange={(e) => {
                e.persist() // for some reason it unfocuses without this!
                if (parseInt(e.target.value) >= 0) {
                  setTask({ ...task, points: parseInt(e.target.value) })
                }
              }}
            />
          </div>
          <div>
            <TextField
              style={{ margin: '12px 4px' }}
              required
              autoFocus
              variant="outlined"
              color="secondary"
              label="Description"
              value={task.description}
              onChange={({ target }) =>
                setTask({ ...task, description: target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            <ChooseColor
              color={task.color || '#FFFFFF'}
              onChange={(color: string) => {
                setTask({ ...task, color })
              }}
            />

            <div style={{ width: 24 }} />

            <FormControl fullWidth>
              <Select
                fullWidth
                value={listId}
                onChange={(e) => {
                  setListId(e.target.value as any)
                }}
              >
                {getAllListsArr(props.projects).map((list, i) => {
                  return (
                    <MenuItem key={list.id} value={list.id}>
                      <pre>
                        <em>{list.name}</em> of{' '}
                        {
                          props.projects[id(props.projects, props.projectId)]
                            .name
                        }
                      </pre>
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>Task's List</FormHelperText>
            </FormControl>
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            <DateTimePicker
              containerClassName="fullwidth"
              value={task.dueDate ? new Date(task.dueDate) : undefined}
              onChange={(date: Date | undefined) => {
                setTask({
                  ...task,
                  dueDate: date ? date.toString() : null
                })
              }}
            />
          </div>

          <Typography
            style={{
              marginTop: 12,
              fontSize: 22
            }}
            variant="subtitle1"
          >
            Subtasks
          </Typography>
          {task.subTasks.map((subTask, i) => (
            <div key={subTask.id} style={{ display: 'flex', marginTop: 8 }}>
              <Checkbox
                style={{ marginRight: 10, width: 32, height: 32 }}
                disableRipple
                checked={task.subTasks[i].completed}
                onChange={(e) => {
                  const subTasks = [...task.subTasks]
                  const newCompleteStatus = !subTasks[i].completed
                  subTasks[i].completed = newCompleteStatus
                  setTask({ ...task, subTasks })

                  setSubtaskExec({
                    variables: {
                      projId: props.projectId,
                      taskId: props.task.id,
                      subtaskId: subTask.id,
                      info: {
                        name: task.subTasks[i].name,
                        completed: newCompleteStatus
                      }
                    }
                  })
                }}
              />
              <TextField
                key={subTask.id}
                margin="none"
                required
                fullWidth
                label={`Subtask ${i}`}
                value={task.subTasks[i].name}
                onBlur={(e) => {
                  setSubtaskExec({
                    variables: {
                      projId: props.projectId,
                      taskId: props.task.id,
                      subtaskId: subTask.id,
                      info: {
                        name: task.subTasks[i].name,
                        completed: subTask.completed
                      }
                    }
                  })
                }}
                onChange={(e) => {
                  setTask({
                    ...task,
                    subTasks: [
                      ...task.subTasks.slice(0, i),
                      { ...task.subTasks[i], name: e.target.value },
                      ...task.subTasks.slice(i + 1)
                    ]
                  })
                }}
              />
              <IconButton
                style={{
                  marginLeft: 10,
                  width: 48,
                  height: 48,
                  marginTop: 'auto'
                }}
                onClick={() => {
                  setTask({
                    ...task,
                    subTasks: task.subTasks.filter(
                      (sub) => sub.id !== task.subTasks[i].id
                    )
                  })
                  setSubtaskExec({
                    variables: {
                      projId: props.projectId,
                      taskId: props.task.id,
                      subtaskId: subTask.id,
                      info: null // means we are deleting
                    }
                  })
                }}
              >
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button
            variant="outlined"
            style={{
              marginTop: 8,
              marginBottom: 8,
              marginLeft: 'auto'
            }}
            onClick={() => {
              const subTaskId = uuid()
              setTask({
                ...task,
                subTasks: [
                  ...task.subTasks,
                  { id: subTaskId, completed: false, name: 'Subtask Name' }
                ]
              })

              setSubtaskExec({
                variables: {
                  projId: props.projectId,
                  taskId: props.task.id,
                  subtaskId: subTaskId,
                  info: {
                    name: 'Subtask Name',
                    completed: false
                  }
                }
              })
            }}
          >
            <Add style={{ marginRight: 8 }} />
            add subtask
          </Button>

          <Typography
            style={{
              marginTop: 12,
              fontSize: 22
            }}
            variant="subtitle1"
          >
            Comments
          </Typography>
          {task.comments.map((comment, i) => (
            <div key={comment.id} style={{ marginTop: 8, display: 'flex' }}>
              <TextField
                key={comment.id}
                margin="dense"
                onBlur={(e) => {
                  setCommentExec({
                    variables: {
                      projId: props.projectId,
                      taskId: props.task.id,
                      commentId: comment.id,
                      description: task.comments[i].comment
                    }
                  })
                }}
                required
                placeholder="Comment Name"
                fullWidth
                value={task.comments[i].comment}
                label={formatDueDate({
                  ...task,
                  dueDate: comment.dateAdded,
                  recurrance: undefined
                }).slice(4)}
                onChange={(e) => {
                  const newComments = [...task.comments]
                  newComments[i].comment = e.target.value

                  setTask({
                    ...task,
                    comments: newComments
                  })
                }}
              />
              <IconButton
                style={{
                  marginLeft: 10,
                  marginTop: 'auto',
                  width: 48,
                  height: 48
                }}
                onClick={() => {
                  setCommentExec({
                    variables: {
                      projId: props.projectId,
                      taskId: props.task.id,
                      commentId: comment.id
                    }
                  })
                }}
              >
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              setCommentExec({
                variables: {
                  projId: props.projectId,
                  taskId: props.task.id,
                  description: 'Comment'
                }
              })
            }}
            style={{ marginTop: 8 }}
          >
            <Add style={{ marginRight: 8 }} />
            Add Comment
          </Button>

          <div
            style={{
              display: 'flex',
              marginTop: 8,
              justifyContent: 'flex-end'
            }}
          >
            <Button color="secondary" type="submit" variant="contained">
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
})
