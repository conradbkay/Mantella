import { useState } from 'react'
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
} from '@mui/material'
import uuid from 'uuid'
import { id, getAllListsArr } from '../../utils/utilities'
import { ChooseColor } from '../ChooseColor'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import { formatDueDate } from '../../utils/formatDueDate'
import { cloneDeep } from 'lodash'
import { EditSubtask } from './Subtask'
import { TComment, TSubtask, TTask } from '../../types/project'
import { Description } from './DescriptionEditor'
import { EditorState } from 'draft-js'
import { getEditorStateFromTaskDescription } from './getEditorState'
import { TState } from '../../types/state'
import { useSelector } from 'react-redux'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

type OwnProps = {
  onClose: () => void
  onSave: (task: TTask, listId: string) => void
  projectId: string
  task: TTask
  ownerListId: string
  SecondaryAction: any
}

/** todo:
 * better code support (several themes and languages)
 * better editor features (fitting headers, colors, etc)
 * make rendering in task base work for everything
 */

export const EditTaskBase = (props: OwnProps) => {
  const [task, setTask] = useState(cloneDeep(props.task))

  const [editorState, setEditorState] = useState(
    task.description
      ? getEditorStateFromTaskDescription(task.description)
      : EditorState.createEmpty()
  )

  const projects = useSelector((state: TState) => state.projects)

  const [listId, setListId] = useState(props.ownerListId)

  const setSubtask = (
    id: string,
    toMergeSubtask?: Partial<Exclude<TSubtask, 'id'>>
  ) => {
    const newTask = cloneDeep(task)
    let subtaskIndex = newTask.subTasks.findIndex((sub) => {
      return sub.id === id
    })

    if (subtaskIndex < 0) {
      subtaskIndex = 0
    }

    if (toMergeSubtask) {
      newTask.subTasks[subtaskIndex] = {
        ...newTask.subTasks[subtaskIndex],
        ...toMergeSubtask
      }
    } else {
      newTask.subTasks = newTask.subTasks.filter((sub) => sub.id !== id)
    }
    setTask(newTask)

    return newTask
  }

  const setComment = (id: string, newComment: Partial<TComment> | null) => {
    const newTask = cloneDeep(task)

    let commentIndex = newTask.comments.findIndex((com) => com.id === id)

    if (commentIndex < 0) {
      commentIndex = 0
    }

    if (!newComment) {
      newTask.comments = newTask.comments.filter((com) => com.id !== id)
    } else {
      newTask.comments[commentIndex] = {
        ...newTask.comments[commentIndex],
        ...newComment
      }
    }

    setTask(newTask)
  }

  return (
    <div>
      <Dialog open onClose={() => props.onClose()}>
        <form
          onSubmit={(e) => {
            props.onSave(task, listId)
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
          <Description
            editorState={editorState}
            setEditorState={setEditorState}
          />
          <div style={{ display: 'flex', margin: '12px 4px 8px 6px' }}>
            <ChooseColor
              color={task.color || '#FFFFFF'}
              onChange={(color: string) => {
                setTask({ ...task, color })
              }}
            />

            <div style={{ width: 24 }} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <FormControl fullWidth>
                <FormHelperText>Task's List</FormHelperText>

                <Select
                  fullWidth
                  value={listId}
                  onChange={(e) => {
                    setListId(e.target.value as any)
                  }}
                >
                  {getAllListsArr(projects).map((list) => {
                    return (
                      <MenuItem key={list.id} value={list.id}>
                        <pre>
                          <em>{list.name}</em> of{' '}
                          {projects[id(projects, list.projectId)].name}
                        </pre>
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <div style={{ marginTop: 8, marginLeft: 'auto' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    ampm={false}
                    label="Due Date"
                    value={task.dueDate ? new Date(task.dueDate) : null}
                    onChange={(date) => {
                      setTask({
                        ...task,
                        dueDate: date ? date.toString() : null
                      })
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
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
            {props.SecondaryAction}
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
