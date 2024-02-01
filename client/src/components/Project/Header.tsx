import {
  AppBar,
  Toolbar,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from '@mui/material'
import { input } from './styles'
import DraggableAvatar from '../Task/DraggableAvatar'
import { memo, useState } from 'react'
import { TProject } from '../../types/project'
import { useDroppable } from '@dnd-kit/core'
import { useDispatch } from 'react-redux'
import Delete from '@mui/icons-material/Delete'
import Calendar from '@mui/icons-material/CalendarToday'
import ViewList from '@mui/icons-material/ViewList'
import ViewDay from '@mui/icons-material/ViewDay'
import { setProjectName } from '../../actions/project'
import LockIcon from '@mui/icons-material/LockOutlined'
import { ShareProjectDialog } from './Share'

type Props = {
  project: TProject
  viewType: string
  setViewType: (newType: string) => void
  setCreating: () => void
  isMobile: boolean
  deleteMode: boolean // when dragging a task, whole header becomes a trash can
}

const ProjectHeader = memo(
  ({
    project,
    deleteMode,
    viewType,
    setViewType,
    setCreating,
    isMobile
  }: Props) => {
    const [name, setName] = useState(project.name)
    const [sharing, setSharing] = useState(false)

    const dispatch = useDispatch()

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
                <input
                  aria-label="project name"
                  style={{
                    ...input(theme),
                    width: /*`${windowWidth - 300}px`*/ isMobile ? 120 : 200
                  }}
                  value={name}
                  onBlur={() => {
                    setProjectName(dispatch, project, name)
                  }}
                  onChange={(e: any) => setName(e.target.value)}
                />
                <ToggleButtonGroup
                  color="primary"
                  style={{ marginLeft: 16 }}
                  value={viewType}
                  size="small"
                  exclusive
                  onChange={(e, newVal) => {
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
                  {/* todo: hide button when enoguh users exist that header is too wide */}
                  {/*<Button
                    variant="outlined"
                    onClick={() => setCreating()}
                    style={{ marginRight: 16 }}
                  >
                    {isMobile ? <Add /> : 'Create Task'}
                  </Button>*/}
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
