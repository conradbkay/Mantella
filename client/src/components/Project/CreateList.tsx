import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  IconButton
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { useState } from 'react'
import { useCreateListMutation } from '../../store/api'

interface Props {
  projectId: string
  open: boolean
  onClose(): void
}

export const CreateList = ({ projectId, open, onClose }: Props) => {
  const [name, setName] = useState('')
  const [createList] = useCreateListMutation()

  return (
    <Dialog open={open} onClose={onClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          createList({ projId: projectId, name: name || 'List' })
          onClose()
        }}
      >
        <DialogTitle>Create List</DialogTitle>
        <IconButton
          style={{ position: 'absolute', top: 12, right: 12 }}
          onClick={onClose}
        >
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
            onChange={({ target }) => setName(target.value)}
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
