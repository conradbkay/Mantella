import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { APIShareProject } from '../../API/project'
import { openSnackbarA } from '../../store/actions/snackbar'
import { TState, TProfile } from '../../types/state'
import { id } from '../../utils/utilities'
type Props = {
  onClose: () => void
  projectId: string
  open: boolean
}

// TODO: open={props.open}
export const ShareProject = ({ onClose, projectId, open }: Props) => {
  const [senderEmail, setSenderEmail] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state: TState) => state.user)
  const projectOwner = useSelector(
    (state: TState) => state.projects[id(state.projects, projectId)]!.ownerId
  )

  const [members, setMembers] = useState([user])
  const [membersLoading, setMembersLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.post('/getProjectMembers', { projectId })

      const projectMembers = data.users.sort((a: any, b: any) => {
        if (projectOwner === a.id) {
          return 1
        } else if (projectOwner === b.id) {
          return -1
        } else {
          return 0
        }
      })

      setMembers(projectMembers)
      setMembersLoading(false)
    }

    fetchData().catch(console.log)
  }, [setMembersLoading, projectId, projectOwner])

  const submit = async () => {
    try {
      await APIShareProject({ email: senderEmail, projectId })

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
        {membersLoading && (
          <CircularProgress
            style={{
              alignSelf: 'center',
              marginRight: 20 /* width is 40, /2=20 */
            }}
          />
        )}
        <List>
          {members
            .filter((m) => m !== null)
            .map((member: TProfile) => (
              <ListItem id={member.id}>
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
