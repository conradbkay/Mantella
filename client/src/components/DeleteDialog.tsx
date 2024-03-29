import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  Theme,
  IconButton,
  DialogTitle,
  TextField,
  Grid
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { useState } from 'react'
import { makeStyles } from '@mui/styles'

interface Props {
  id: string
  name: 'Project' | 'Column' | 'Content'
  inputName?: string
  onClose(): void
  deleteFunc(id: string): void
}

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))

const DeleteColumnDialogComponent = (props: Props) => {
  const [confirm, setConfirm] = useState('')

  const onSubmit = () => {
    props.deleteFunc(props.id)
    props.onClose() // need this so it doesn't delete another column
  }

  const classes = useStyles()

  const { onClose, name, inputName } = props
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Delete {inputName ? inputName : name}</DialogTitle>
      <IconButton className={classes.closeButton} onClick={onClose}>
        <Close />
      </IconButton>
      <DialogContent>
        <DialogContentText>
          Deleted {name} cannot be restored. Are you sure about this?
        </DialogContentText>
      </DialogContent>
      <div
        style={{
          margin: 8
        }}
      >
        {typeof inputName === 'string' && (
          <TextField
            autoFocus
            style={{ margin: 4, marginBottom: 20 }}
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            label={`Please type in the name of the ${name} to confirm.`}
          />
        )}
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Button fullWidth onClick={onClose} color="secondary">
              Cancel
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              onClick={onSubmit}
              fullWidth
              disabled={inputName ? confirm !== inputName : false}
              variant="contained"
              color="primary"
            >
              Delete {name}
            </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  )
}

export const DeleteDialog = DeleteColumnDialogComponent
