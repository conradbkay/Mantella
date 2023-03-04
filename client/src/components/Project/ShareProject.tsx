import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  IconButton,
  ListItemSecondaryAction
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { APIShareProject } from '../../API/project'
import { openSnackbarA } from '../../store/actions/snackbar'
import { TState } from '../../types/state'
import { id } from '../../utils/utilities'
import { Delete } from '@mui/icons-material'
import { setProjectA } from '../../store/actions/project'
type Props = {
  onClose: () => void
  projectId: string
  open: boolean
}

// TODO: open={props.open}
export const ShareProject = ({ onClose, projectId, open }: Props) => {
  const [senderEmail, setSenderEmail] = useState('')
  const dispatch = useDispatch()
  const project = useSelector(
    (state: TState) => state.projects[id(state.projects, projectId)]
  )
  const user = useSelector((state: TState) => state.user)

  const submit = async () => {
    try {
      const res = await APIShareProject({ email: senderEmail, projectId })

      const project = res[1]

      dispatch(setProjectA({ id: project.id, newProj: project }))

      onClose()

      dispatch(openSnackbarA('User invited', 'success'))
    } catch (err) {
      dispatch(
        openSnackbarA(
          'User could not be invited, did you enter the correct email?',
          'error'
        )
      )
    }
  }

  return (
    <Dialog maxWidth={'xs'} onClose={onClose} open={open}>
      <DialogTitle>Share Project</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <DialogContentText style={{ marginBottom: 0 }}>
          Members
        </DialogContentText>
        <List>
          {project.users.map((member) => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                <img
                  alt="profile"
                  style={{ borderRadius: '50%' }}
                  width={32}
                  height={32}
                  src={member.profileImg}
                />
              </ListItemAvatar>
              <ListItemText
                primary={member.username}
                secondary={member.email}
              />
              <ListItemSecondaryAction>
                <IconButton
                  disabled={project.ownerId !== user!.id}
                  edge="end"
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Typography style={{ fontSize: 16 }}>
          Enter the invitee's email address that was used to join Mantella, they
          will automatically have access when they sign in
        </Typography>
        <div style={{ display: 'flex', padding: '16px 0' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="johnsmith@email.com"
            type="email"
            style={{ flexGrow: 1 }}
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
          <Button
            onClick={() => submit()}
            style={{ height: '100%', margin: 'auto 0 auto 8px' }}
            variant="contained"
            color="primary"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}