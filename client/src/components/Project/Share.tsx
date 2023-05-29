import {
  Button,
  Dialog,
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
import { TState } from '../../types/state'
import Delete from '@mui/icons-material/Delete'
import { TProject } from '../../types/project'
import { kickUser, shareProject } from '../../actions/project'

type Props = {
  project: TProject
}

export const ShareProject = ({
  project,
  onClose
}: Props & { onClose?: () => void }) => {
  const [senderEmail, setSenderEmail] = useState('')
  const dispatch = useDispatch()

  const user = useSelector((state: TState) => state.user)
  const theme = useTheme()

  return (
    <DialogContent
      style={{
        display: 'flex',
        flexDirection: 'column'
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
                onClick={() => kickUser(dispatch, project.id, member.id)}
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
          onClick={() => {
            shareProject(dispatch, project.id, senderEmail)
            if (onClose) {
              onClose()
            }
          }}
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

export const ShareProjectDialog = ({
  project,
  open,
  onClose
}: Props & { open: boolean; onClose: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={'xs'}>
      <ShareProject project={project} />
    </Dialog>
  )
}
