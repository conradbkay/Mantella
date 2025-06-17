import {
  AppBar,
  Toolbar,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Typography
} from '@mui/material'
import DraggableAvatar from '../Task/DraggableAvatar'
import { memo, useState } from 'react'
import { TProject } from '../../types/project'
import { useDroppable } from '@dnd-kit/core'
import Delete from '@mui/icons-material/Delete'
import Calendar from '@mui/icons-material/CalendarToday'
import ViewList from '@mui/icons-material/ViewList'
import ViewDay from '@mui/icons-material/ViewDay'
import LockIcon from '@mui/icons-material/LockOutlined'
import { ShareProjectDialog } from './Share'

type Props = {
  project: TProject
  viewType: string
  setViewType: (newType: string) => void
  isMobile: boolean
  deleteMode: boolean // when dragging a task, whole header becomes a trash can
}

const ProjectHeader = memo(
  ({ project, deleteMode, viewType, setViewType, isMobile }: Props) => {
    const [sharing, setSharing] = useState(false)

    const { setNodeRef } = useDroppable({ id: 'users' })

    const theme = useTheme()

    const trash = useDroppable({ id: 'trash' })

    return (
      <>
        <AppBar color="default" position="static">
          <Toolbar
            style={
              deleteMode
                ? { padding: 0, display: 'flex', alignItems: 'stretch' }
                : undefined
            }
          >
            {deleteMode ? (
              <div
                ref={trash.setNodeRef}
                style={{
                  ...theme.typography.button,
                  backgroundColor: theme.palette.error.dark,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  width: '100%'
                }}
              >
                <Delete style={{ marginRight: 12, fontSize: 28 }} />
                DELETE TASK
              </div>
            ) : (
              <>
                <Typography
                  variant="h6"
                  component="h1"
                  style={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: 18,
                    width: isMobile ? 120 : 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {project.name}
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  style={{ marginLeft: 16 }}
                  value={viewType}
                  size="small"
                  exclusive
                  onChange={(_, newVal) => {
                    if (newVal) {
                      setViewType(newVal)
                    }
                  }}
                >
                  {!isMobile && (
                    <ToggleButton value="kanban">Kanban</ToggleButton>
                  )}
                  <ToggleButton value="lists">
                    {isMobile ? <ViewDay /> : 'lists'}
                  </ToggleButton>

                  <ToggleButton
                    value="tasks"
                    disabled={project.tasks.length === 0}
                  >
                    {isMobile ? <ViewList /> : 'Tasks'}
                  </ToggleButton>
                  <ToggleButton value="calendar">
                    {isMobile ? <Calendar /> : 'Calendar'}
                  </ToggleButton>
                </ToggleButtonGroup>

                <div style={{ marginLeft: 'auto', display: 'flex' }}>
                  <div ref={setNodeRef} style={{ display: 'flex' }}>
                    {project.users.map((user) => (
                      <DraggableAvatar user={user} key={user.id} />
                    ))}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSharing(true)}
                    style={{ marginLeft: 16 }}
                  >
                    <LockIcon style={{ marginRight: 8 }} />
                    <span style={{ fontSize: '13.5px' }}>Share</span>
                  </Button>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
        <ShareProjectDialog
          project={project}
          open={sharing}
          onClose={() => setSharing(false)}
        />
      </>
    )
  },
  (oldProps, newProps) => {
    const same =
      oldProps.project.users === newProps.project.users &&
      oldProps.project.name === newProps.project.name &&
      oldProps.deleteMode === newProps.deleteMode &&
      oldProps.viewType === newProps.viewType &&
      oldProps.isMobile === newProps.isMobile

    return same
  }
)

export default ProjectHeader
