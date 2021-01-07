import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core'
import { connect } from 'react-redux'
import { GQL_CREATE_TASK } from '../../../graphql/mutations/task'
import {
  CreateTaskMutation,
  CreateTaskMutationVariables
} from '../../../graphql/types'
import { useMutation } from 'react-apollo'
import { setProjectA } from '../../../store/actions/project'
import { Close } from '@material-ui/icons'
import { ChooseColor } from '../../utils/chooseColor'
import { TProject } from '../../../types/project'
import { DateTimePicker } from 'react-widgets'
const actionCreators = {
  setProject: setProjectA
}

type OwnProps = {
  onClose: () => void
  project: TProject
  columnId: string
  listId: string
}

type TProps = OwnProps & typeof actionCreators

export const CreateTask = connect(
  null,
  actionCreators
)((props: TProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#FFFFFF')
  const [points, setPoints] = useState(0)
  const [listId, setListId] = useState(props.project.lists[0].id)
  const [dueDate, setDueDate] = useState(undefined as undefined | Date)
  const [createTaskExec] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(GQL_CREATE_TASK, {
    onCompleted: ({ createTask }) => {
      if (createTask && createTask.task && createTask.project) {
        props.setProject({
          id: createTask.project.id,
          newProj: createTask.project
        })
      }
      props.onClose()
    },
    onError: () => props.onClose()
  })

  return (
    <Dialog open={true} onClose={() => props.onClose()}>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          createTaskExec({
            variables: {
              projId: props.project.id,
              listId: listId,
              taskInfo: {
                points,
                color,
                name,
                dueDate: dueDate ? dueDate.toString() : undefined,
                description
              }
            }
          })
        }}
      >
        <DialogTitle>Create Task</DialogTitle>
        <IconButton
          style={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          onClick={() => props.onClose()}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Tasks should be a small chunk of what you need to do. For example,
            if you needed to create a Youtube video, a task could be: "Create
            Thumbnail"
          </DialogContentText>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '0 0 auto',
              marginTop: 12
            }}
          >
            <TextField
              style={{ margin: '0 4px' }}
              required
              autoFocus
              variant="outlined"
              color="secondary"
              label="Title"
              value={name}
              onChange={({ target }) => setName(target.value)}
              fullWidth
            />
            <TextField
              style={{ margin: '0 4px', width: '33%' }}
              required
              fullWidth
              variant="outlined"
              label="Points"
              value={points}
              type="number"
              onChange={(e) => {
                e.persist() // for some reason it unfocuses without this!
                if (parseInt(e.target.value) >= 0) {
                  setPoints(parseInt(e.target.value))
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
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <ChooseColor
              color={color || '#FFFFFF'}
              onChange={(color: string) => {
                setColor(color)
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
                {props.project.lists.map((list, i) => {
                  return (
                    <MenuItem key={list.id} value={list.id}>
                      <pre>
                        <em>{list.name}</em>
                      </pre>
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>Task's List</FormHelperText>
            </FormControl>
          </div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <DateTimePicker
              dropUp
              containerClassName="fullwidth"
              value={dueDate}
              onChange={(date) => {
                setDueDate(date)
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})
