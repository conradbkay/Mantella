import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core'
import { connect } from 'react-redux'
import { TProject } from '../../types/project'
import { setProjectA } from '../../store/actions/project'
import { Delete } from '@material-ui/icons'
import { openSnackbarA } from '../../store/actions/snackbar'

type ActionCreators = typeof actionCreators

interface Props extends ActionCreators {
  onClose: () => void
  project: TProject
}

const CProjectSettings = (props: Props) => {
  const [hasClicked, setClicked] = React.useState(false)

  const deleteProject = () => {
    location.hash = '/dashboard'
    props.setProject({ id: props.project.id, newProj: null })
  }

  return (
    <Dialog onClose={props.onClose} open={true}>
      <div style={{ minWidth: '500px' }} />
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <Typography style={{ fontSize: 20 }}>
          <span style={{ color: 'red', marginRight: 8 }}>Danger Zone!</span>
        </Typography>
        <ListItem>
          <ListItemAvatar>
            <Delete />
          </ListItemAvatar>
          <ListItemText
            primary="Delete this project"
            secondary="Once deleted, projects cannot be restored"
          />
          <Button
            size="medium"
            onClick={() => {
              if (hasClicked) {
                deleteProject()
              } else {
                setClicked(true)
              }
            }}
            color="primary"
            variant={hasClicked ? 'contained' : 'outlined'}
            style={{ marginLeft: 16, maxHeight: 36, marginTop: 'auto' }}
          >
            {hasClicked ? 'Confirm' : 'Delete'}
          </Button>
        </ListItem>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Continue</Button>
      </DialogActions>
    </Dialog>
  )
}

const actionCreators = {
  setProject: setProjectA,
  openSnackbar: openSnackbarA
}

export const ProjectSettings = connect(null, actionCreators)(CProjectSettings)
