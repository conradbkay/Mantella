import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  IconButton,
  DialogTitle,
  TextField,
  Box
} from '@mui/material'
import Close from '@mui/icons-material/Close'
import { useState } from 'react'

interface Props {
  id: string
  name: 'Project' | 'Column' | 'Content'
  inputName?: string
  onClose(): void
  deleteFunc(id: string): void
}

const DeleteColumnDialogComponent = (props: Props) => {
  const [confirm, setConfirm] = useState('')

  const onSubmit = () => {
    props.deleteFunc(props.id)
    props.onClose() // need this so it doesn't delete another column
  }

  const { onClose, name, inputName } = props
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Delete {inputName ? inputName : name}</DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          right: (theme) => theme.spacing(1),
          top: (theme) => theme.spacing(1),
          color: (theme) => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
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
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Button fullWidth onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            fullWidth
            disabled={inputName ? confirm !== inputName : false}
            variant="contained"
            color="primary"
          >
            Delete {name}
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}

export const DeleteDialog = DeleteColumnDialogComponent
