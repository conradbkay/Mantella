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
import { Change } from '../../types/types'
import { TProject } from '../../types/project'
import { useState } from 'react'
import { APICreateList } from '../../API/list'
import { useAppDispatch } from '../../store/hooks'
import { SET_LIST } from '../../store/projects'

interface Props {
  project: TProject
  onClose(): void
}

export const CreateList = ({ project, onClose }: Props) => {
  const [name, setName] = useState('')

  const dispatch = useAppDispatch()

  return (
    <Dialog open={true} onClose={onClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const list = await APICreateList(project.id, name || 'List')

          dispatch(
            SET_LIST({
              id: list.id,
              projectId: project.id,
              newList: list
            })
          )

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
