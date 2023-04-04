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
import { APIEditProject } from '../../API/project'
import Delete from '@mui/icons-material/Delete'
import { SET_PROJECT } from '../../store/projects'

type Props = {
  project: TProject
  viewType: string
  setViewType: (newType: string) => void
  setCreating: () => void
  deleteMode: boolean // when dragging a task, whole header becomes a trash can
}

const ProjectHeader = memo(
  ({ project, deleteMode, viewType, setViewType, setCreating }: Props) => {
    const [name, setName] = useState(project ? project.name : undefined)

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
                    width: /*`${windowWidth - 300}px`*/ 200
                  }}
                  value={name}
                  onBlur={() => {
                    dispatch(
                      SET_PROJECT({
                        id: project.id,
                        project: { ...project, name: name || 'newname' }
                      })
                    )

                    APIEditProject(project.id, { name: name || 'newname' })
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
                  <ToggleButton value="kanban">Kanban</ToggleButton>
                  <ToggleButton value="lists">lists</ToggleButton>

                  <ToggleButton
                    value="tasks"
                    disabled={project.tasks.length === 0}
                  >
                    Tasks
                  </ToggleButton>
                  <ToggleButton value="calendar">Calendar</ToggleButton>
                </ToggleButtonGroup>

                <div style={{ marginLeft: 'auto', display: 'flex' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setCreating()}
                    style={{ marginRight: 8 }}
                  >
                    Create Task
                  </Button>
                  <div ref={setNodeRef} style={{ display: 'flex' }}>
                    {project.users.map((user, i) => (
                      <DraggableAvatar user={user} key={user.id} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
      </>
    )
  },
  (oldProps, newProps) => {
    const same =
      oldProps.project.users === newProps.project.users &&
      oldProps.project.name === newProps.project.name &&
      oldProps.deleteMode === newProps.deleteMode &&
      oldProps.viewType === newProps.viewType

    return same
  }
)

export default ProjectHeader