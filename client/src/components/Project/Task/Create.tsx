import React, { useState } from 'react'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Tooltip } from '@material-ui/core'
import { connect } from 'react-redux'
import { GQL_CREATE_TASK } from '../../../graphql/mutations/task'
import { CreateTaskMutation, CreateTaskMutationVariables } from '../../../graphql/types'
import {useMutation} from 'react-apollo'
import { setProjectA } from '../../../store/actions/project'
import { Close } from '@material-ui/icons'
import { Change } from '../../../types/types'
import { ChooseColor } from '../../utils/chooseColor'
const actionCreators = {
  setProject: setProjectA
}

type OwnProps = {
  onClose: () => void
  projectId: string
  columnId: string
  listId: string
}

type TProps = OwnProps & typeof actionCreators

export const CreateTask = connect(
  null,
  actionCreators
)((props: TProps) => {
  const [name, setName] = useState('')
  const [hasDate, setHasDate] = useState(false)
  const [color, setColor] = useState('#FFFFFF')
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
        onSubmit={e => {
          e.preventDefault()

          createTaskExec({
            variables: {
              projId: props.projectId,
              listId: props.listId,
              // columnId: props.columnId,
              taskInfo: {
                // color,
                name
              }
            }
          })
        }}
      >
        <DialogTitle>Create Task</DialogTitle>
        <IconButton style={{ position: 'absolute',
      right: 8,
      top: 8,
      color: 'gray' }} onClick={() => props.onClose()}>
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Tasks should be a small chunk of what you need to do.
            For example, if you needed to create a Youtube thumbnail, the first
            task would be: "Create Title"
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            value={name}
            onChange={({ target }: Change) => setName(target.value)}
            fullWidth
          />
          <div style={{ display: 'flex', margin: '16px 0px' }}>
            <Tooltip title="Should Task enforce Due Date?">
              <Checkbox
                style={{ display: 'inline-block' }}
                checked={hasDate}
                onChange={e => setHasDate(e.target.checked)}
              />
            </Tooltip>
          </div>
          <ChooseColor
            color={color}
            onChange={(newColor: string) => setColor(newColor)}
          />
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