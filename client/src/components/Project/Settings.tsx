import {
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme
} from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { useAppDispatch } from '../../store/hooks'
import { SET_PROJECT } from '../../store/projects'

type Props = {
  projectId: string
}

export const ProjectSettings = ({ projectId }: Props) => {
  const [hasClicked, setClicked] = useState(false)
  const navigate = useHistory()
  const dispatch = useAppDispatch()

  const deleteProject = () => {
    dispatch(SET_PROJECT({ id: projectId, project: undefined }))
    navigate.push('/dashboard')
  }

  const theme = useTheme()

  return (
    <div
      style={{
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16
      }}
    >
      <Typography style={{ fontSize: 20, textAlign: 'center' }}>
        <span style={{ color: 'red', marginRight: 8 }}>Danger Zone!</span>
      </Typography>
      <ListItem style={{ color: theme.palette.text.secondary }}>
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
          color="secondary"
          variant={hasClicked ? 'contained' : 'outlined'}
          style={{ maxHeight: 36, margin: 'auto' }}
        >
          {hasClicked ? 'Confirm' : 'Delete'}
        </Button>
      </ListItem>
    </div>
  )
}
