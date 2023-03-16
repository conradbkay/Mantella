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
  IconButton
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { Change } from '../../types/types'
import { setListA } from '../../store/actions/list'
import { TProject } from '../../types/project'
import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { APICreateList } from '../../API/list'

type ActionCreators = typeof actionCreators

interface Props extends ActionCreators {
  project: TProject
  onClose(): void
}

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))

const CCreateColumn = (props: Props) => {
  const { project, onClose } = props
  const classes = useStyles()

  const [name, setName] = useState('')

  return (
    <Dialog open={true} onClose={onClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const list = await APICreateList(project.id, name || 'List')

          props.setList({
            id: list.id,
            projectId: project.id,
            newList: list
          })

          onClose()
        }}
      >
        <DialogTitle>Create List</DialogTitle>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Lists should contain either a type or date of task. Ex: "Amanda",
            "Expert Tasks", or "Writing"
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            label="List Name"
            value={name}
            onChange={({ target }: Change) => setName(target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const actionCreators = {
  setList: setListA
}
// rename
export const CreateColumn = connect(null, actionCreators)(CCreateColumn)