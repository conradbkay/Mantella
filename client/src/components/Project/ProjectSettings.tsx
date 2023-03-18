import {
  DialogContent,
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material'
import { connect } from 'react-redux'
import { setProjectA } from '../../store/actions/project'
import Delete from '@mui/icons-material/Delete'
import { openSnackbarA } from '../../store/actions/snackbar'
import { useState } from 'react'

type ActionCreators = typeof actionCreators

interface Props extends ActionCreators {
  projectId: string
}

const CProjectSettings = (props: Props) => {
  const [hasClicked, setClicked] = useState(false)

  const deleteProject = () => {
    window.location.href = '/dashboard'
    props.setProject({ id: props.projectId, newProj: null })
  }

  return (
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
  )
}

const actionCreators = {
  setProject: setProjectA,
  openSnackbar: openSnackbarA
}

export const ProjectSettings = connect(null, actionCreators)(CProjectSettings)
