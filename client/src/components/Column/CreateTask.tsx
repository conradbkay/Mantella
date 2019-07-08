import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Theme,
  createStyles,
  WithStyles,
  IconButton,
  withStyles,
  Checkbox,
  Tooltip
} from '@material-ui/core'

import { Change } from '../../types/types'
import { setTaskA } from '../../store/actions/task'
import { ChooseColor } from '../utils/chooseColor'
import { TState } from '../../types/state'
import {
  CreateTaskMutation,
  CreateTaskMutationVariables
} from '../../graphql/types'
import { GQL_CREATE_TASK } from '../../graphql/mutations/task'
import { setProjectA } from '../../store/actions/project'
import { useMutation } from '@apollo/react-hooks'
import { resToNiceTask, resToNiceProject } from '../../API/utils'
import { Close } from '@material-ui/icons'

type CreateTaskProps = ReturnType<typeof mapState> &
  typeof actionCreators &
  OwnProps &
  WithStyles<typeof styles>

interface OwnProps {
  projectId: string
  columnId: string
  onClose(): void
}

const styles = (theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

const CCreateTask = (props: CreateTaskProps) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#FFFFFF')
  // const [dueDate, setDueDate] = useState(new Date())
  const [hasDate, setHasDate] = useState(false)

  const [createTaskExec] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(GQL_CREATE_TASK, {
    onCompleted: ({ createTask }) => {
      if (createTask && createTask.task && createTask.project) {
        props.setTask({
          newTask: resToNiceTask(createTask.task),
          id: createTask.task.id,
          projectId: createTask.project.id
        })
        props.setProject({
          id: createTask.project.id,
          newProj: resToNiceProject(createTask.project)
        })
      }
      props.onClose()
    },
    onError: () => props.onClose()
  })

  const { onClose, classes } = props
  return (
    <Dialog open={true} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()

          createTaskExec({
            variables: {
              projId: props.projectId,
              columnId: props.columnId,
              taskInfo: {
                color,
                name
              }
            }
          })
        }}
      >
        <DialogTitle>Create Task</DialogTitle>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Tasks should be the smallest possible chunk of what you need to do.
            For example, if you needed to create a Youtube thumbnail, the first
            task would be: "Create Title".
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
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const mapState = (state: TState, ownProps: OwnProps) => {
  return {
    column: state.projects[ownProps.projectId].columns[ownProps.columnId]
  }
}
const actionCreators = {
  setTask: setTaskA,
  setProject: setProjectA
}

export const CreateTask = connect(
  mapState,
  actionCreators
)(withStyles(styles)(CCreateTask))
