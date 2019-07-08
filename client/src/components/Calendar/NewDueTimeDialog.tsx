import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { TTask } from '../../types/task'

type OwnProps = {
  draggingTask: TTask
  onClose: () => void
  handleDateChange: (date: Date) => void
  onEdit: () => void
}

/** used when they drag a task across calendar, we want to know what exact time they want to move to */

export const NewDueTimeDialog = (props: OwnProps) => {
  const { draggingTask } = props
  return (
    <Dialog open={draggingTask !== null} onClose={props.onClose}>
      <form
        onSubmit={() => {
          props.onEdit()
        }}
        style={{ minHeight: 100, minWidth: 500 }}
      >
        <DialogTitle>Set Task Due Date</DialogTitle>
        <DialogContent>
          <IconButton
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#9e9e9e'
            }}
            onClick={props.onClose}
          >
            <Close />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={props.onClose}>
            Keep Original
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
