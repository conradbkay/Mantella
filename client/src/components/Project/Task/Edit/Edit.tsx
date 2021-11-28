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
  IconButton
} from '@material-ui/core'
import uuid from 'uuid'
import { connect } from 'react-redux'
import { TState } from '../../../../types/state'
import { id, getAllListsArr } from '../../../../utils/utilities'
import { setTaskA } from '../../../../store/actions/task'
import { ChooseColor } from '../../../utils/chooseColor'
import { setProjectA } from '../../../../store/actions/project'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import { Add, Delete } from '@material-ui/icons'
import { formatDueDate } from '../../../../utils/formatDueDate'
import { cloneDeep } from 'lodash'
import { EditSubtask } from './Subtask'
import { TComment, TSubtask } from '../../../../types/project'

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

type ActionCreators = typeof actionCreators

interface TProps
  extends OwnProps,
    ReturnType<typeof mapState>,
    ActionCreators {}

export const EditTaskModal = connect(
  mapState,
  actionCreators
)((props: TProps) => {
  const [task, setTask] = useState(cloneDeep(props.task))

  const project = props.projects[id(props.projects, props.projectId)]

  const ownerListId = project.lists.find((list) =>
    list.taskIds.includes(task.id)
  )!.id

  const [listId, setListId] = useState(ownerListId)

  const setSubtask = (
    id: string,
    toMergeSubtask?: Partial<Exclude<TSubtask, 'id'>>
  ) => {
    const newTask = cloneDeep(task)
    const subtaskIndex = newTask.subTasks.findIndex((sub) => {
      return sub.id === id
    })
    if (toMergeSubtask) {
      newTask.subTasks[subtaskIndex] = {
        ...newTask.subTasks[subtaskIndex],
        ...toMergeSubtask
      }
    } else {
      newTask.subTasks.filter((sub) => sub.id !== id)
    }
    setTask(newTask)

    return newTask
  }

  const setComment = (id: string, newComment: Partial<TComment> | null) => {}

  const deleteTask = () => {
    props.setTask({ id: task.id, projectId: props.projectId, newTask: null })
  }

  const dragTask = (taskId: string, info: any) => {
    // TODO: fix
    props.setProject({ id: project.id, newProj: project })
  }

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

              dragTask(task.id, {
                oldListId: ownerListId,
                newListId: listId,
                newIndex,
                newProgress: task.progress,
                projectId: props.projectId
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
          {task.subTasks.map((subtask, i) => (
            <EditSubtask setSubtask={setSubtask} subtask={subtask} />
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
              setSubtask(subTaskId, {
                id: subTaskId,
                completed: false,
                name: 'Subtask Name'
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
                  setComment(comment.id, {
                    comment: task.comments[i].comment,
                    lastEdited: new Date().toString()
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
                  setComment(comment.id, null)
                }}
              >
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const newCommentId = uuid()
              setComment(newCommentId, {
                id: newCommentId,
                comment: 'Comment',
                dateAdded: new Date().toString()
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
            <Button color="secondary" type="submit" variant="contained">
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
})
