import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  Paper,
  TextField,
  useTheme
} from '@mui/material'
import { Socket } from 'socket.io-client'
import { ChatMembers } from './Members'
import { ChatMessages } from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import { selectProjects } from '../../store/projects'
import { useState } from 'react'
import { TProjectUser } from '../../types/project'
import ExpandMore from '@mui/icons-material/ExpandMore'
import NavigateNext from '@mui/icons-material/NavigateNext'
import Add from '@mui/icons-material/Add'
import Close from '@mui/icons-material/Close'
import { createChannel, deleteChannel, editChannel } from '../../actions/chat'
import Settings from '@mui/icons-material/SettingsOutlined'
import { id } from '../../utils/utils'
import useTitle from '../useTitle'
import { inverse } from '../../utils/color'

export const Chat = ({ socket }: { socket: Socket }) => {
  const theme = useTheme()

  const projects = useSelector(selectProjects)

  const [open, setOpen] = useState(projects[0].channels[0])

  const [creating, setCreating] = useState<string | null>(null)
  const [name, setName] = useState('')

  const [editing, setEditing] = useState<
    [string, string, string, string] | null
  >(null)

  const [collapsed, setCollapsed] = useState(projects.map((p) => false))

  const openProject = projects.find((p) =>
    p.channels.map((c) => c[0]).includes(open[0])
  )

  const users = projects.reduce((acc, p) => {
    const ids = acc.map((u) => u.id)
    return [...acc, ...p.users.filter((u) => !ids.includes(u.id))]
  }, [] as TProjectUser[])

  const bg = theme.palette.background.paper

  const dispatch = useDispatch()

  const onClose = () => {
    setCreating(null)
    setName('')
  }

  useTitle('Mantella - Chat') // TODO: unread messages in parenthesis

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 58.5px)',
        display: 'flex',
        backgroundColor: inverse(bg, 0.4)
      }}
    >
      <div
        style={{
          backgroundImage: 'none',
          width: 350,
          backgroundColor: inverse(bg, 0.3)
        }}
      >
        <Paper
          elevation={4}
          sx={{
            height: 48,
            display: 'flex',
            borderRadius: 0,
            backgroundColor: inverse(bg, 0.3),
            backgroundImage: 'none',
            alignItems: 'center',
            pl: 4
          }}
        >
          hi
        </Paper>
        <List>
          {projects.map((project, i) => (
            <div key={project.id}>
              <ListItemButton
                sx={{
                  color: theme.palette.text.primary,
                  height: 48,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
                onClick={() => {
                  setCollapsed(collapsed.map((c, j) => (i === j ? !c : c)))
                }}
              >
                {collapsed[i] ? <NavigateNext /> : <ExpandMore />}

                {project.name}
                <IconButton
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCreating(project.id)
                  }}
                  style={{ marginLeft: 'auto', marginRight: -4 }}
                >
                  <Add />
                </IconButton>
              </ListItemButton>
              <Collapse in={!collapsed[i]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {project.channels.map(([id, name]) => (
                    <ListItemButton
                      disableRipple
                      onClick={(e) => setOpen([id, name])}
                      selected={open[0] === id}
                      key={id}
                      sx={{
                        pl: 5.25,
                        height: 40,
                        color: theme.palette.text.secondary,
                        '&.Mui-selected': {
                          backgroundColor: inverse(bg, 1.0)
                        },
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {name}
                      <IconButton
                        sx={{ color: theme.palette.text.secondary }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditing([project.id, id, name, name])
                        }}
                        style={{ marginLeft: 'auto', height: 32, width: 32 }}
                      >
                        <Settings />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </div>
      <ChatMessages
        users={openProject!.users}
        channel={open}
        open
        socket={socket}
      />
      <ChatMembers users={users} />
      <Dialog open={Boolean(creating)} onClose={() => setCreating(null)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            onClose()
            const newChannel = await createChannel(
              dispatch,
              openProject!.id,
              name
            )
            if (newChannel) {
              setOpen(newChannel)
            }
          }}
        >
          <DialogTitle>Create Channel</DialogTitle>

          <IconButton
            style={{ position: 'absolute', top: 12, right: 12 }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <DialogContent style={{ minWidth: 352 }}>
            <TextField
              required
              autoFocus
              margin="dense"
              label="Channel Name"
              value={name}
              onChange={({ target }) => setName(target.value)}
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
      <Dialog onClose={() => setEditing(null)} open={Boolean(editing)}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setEditing(null)

            if (editing && editing[2] !== editing[3]) {
              editChannel(dispatch, editing[0], editing[1], editing[2])
            }
          }}
        >
          <DialogTitle>Edit Channel</DialogTitle>

          <IconButton
            style={{ position: 'absolute', top: 12, right: 12 }}
            onClick={() => setEditing(null)}
          >
            <Close />
          </IconButton>

          <DialogContent style={{ minWidth: 300 }}>
            <TextField
              autoFocus
              fullWidth
              name="Channel Name"
              value={editing ? editing[2] : ''}
              onBlur={() => {
                if (editing && editing[2] !== editing[3]) {
                  editChannel(dispatch, editing[0], editing[1], editing[2])
                }
              }}
              onChange={(e) => {
                setEditing([
                  editing![0],
                  editing![1],
                  e.target.value,
                  editing![3]
                ])
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disabled={
                editing
                  ? projects[id(projects, editing![0])].channels.length <= 1
                  : true
              }
              color="secondary"
              onClick={async () => {
                setEditing(null)
                deleteChannel(dispatch, editing![0], editing![1])

                if (open[0] === editing![1]) {
                  const project = projects[id(projects, editing![0])]
                  setOpen(
                    project.channels.filter((c) => c[0] !== editing![1])![0]
                  )
                }
              }}
            >
              Delete Channel
            </Button>
            <Button type="submit" style={{ marginLeft: 8 }}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
