import {
  Button,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  IconButton,
  useTheme,
  ListItemSecondaryAction
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { APIKickUser, APIShareProject } from '../../API/project'
import { openSnackbarA } from '../../store/actions/snackbar'
import { TState } from '../../types/state'
import Delete from '@mui/icons-material/Delete'
import { setProjectA } from '../../store/actions/project'
import { TProject } from '../../types/project'
type Props = {
  project: TProject
}

// TODO: open={props.open}
export const ShareProject = ({ project }: Props) => {
  const [senderEmail, setSenderEmail] = useState('')
  const dispatch = useDispatch()

  const user = useSelector((state: TState) => state.user)
  const theme = useTheme()

  const submit = async () => {
    try {
      const res = await APIShareProject({
        email: senderEmail,
        projectId: project.id
      })

      const newProj = res[1]

      dispatch(setProjectA({ id: newProj.id, newProj }))

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

  const kickUser = async (kickingId: string) => {
    try {
      const res = await APIKickUser(project.id, kickingId)

      dispatch(setProjectA({ id: res.project.id, newProj: res.project }))
    } catch (err) {
      dispatch(openSnackbarA('User could not be kicked', 'error'))
    }
  }

  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 352 /* 24px padding twice */
      }}
    >
      <DialogContentText
        style={{ marginBottom: 0, color: theme.palette.text.secondary }}
      >
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
              style={{ color: theme.palette.text.primary }}
              primary={member.username}
              secondary={member.email}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => kickUser(member.id)}
                disabled={
                  project.ownerId !== user!.id || member.id === user!.id
                }
                edge="end"
                aria-label="delete"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Typography style={{ fontSize: 16, color: theme.palette.text.secondary }}>
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
  )
}
