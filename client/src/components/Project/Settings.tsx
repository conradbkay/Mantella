import {
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  List,
  ListItemButton,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  IconButton
} from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import { useState } from 'react'
import { useHistory } from 'react-router'
import { useAppDispatch } from '../../store/hooks'
import { deleteProject, moveRole, setRole } from '../../actions/project'
import { TProject, TRole } from '../../types/project'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import Draggable from '../Task/Draggable'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MyPointerSensor } from './Project'
import { cloneDeep } from 'lodash'
import { ChooseColor } from '../ChooseColor'
import Add from '@mui/icons-material/Add'
import { nanoid } from 'nanoid'
import Color from 'color'
import Edit from '@mui/icons-material/Edit'

type Props = {
  project: TProject
}

const RoleBase = ({
  role,
  actionText,
  setRole,
  deleteFunc,
  save,
  project
}: {
  role: TRole
  setRole: React.Dispatch<React.SetStateAction<null | TRole>>
  actionText: string
  deleteFunc?: () => void
  save: () => void
  project: TProject
}) => {
  return (
    <Dialog open onClose={() => setRole(null)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <DialogTitle>{actionText}</DialogTitle>
        <div style={{ minWidth: 300, padding: '12px 16px' }}>
          <TextField
            autoFocus
            label="Role Name"
            value={role.name}
            onChange={(e) =>
              setRole((prev) => ({ ...prev!, name: e.target.value }))
            }
            style={{ marginBottom: 16 }}
            fullWidth
          />
          <ChooseColor
            selected={role.color}
            project={project}
            onChange={(color: string) => {
              setRole((prev) => ({ ...prev!, color }))
            }}
          />
        </div>
        <DialogActions>
          {deleteFunc && (
            <Button onClick={deleteFunc} color="error">
              Delete
            </Button>
          )}
          <Button onClick={() => setRole(null)}>Cancel</Button>
          <Button variant="contained" type="submit">
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const defaultRole: TRole = {
  name: '',
  color: '#FEFEFE',
  id: ''
}

const RoleItem = ({ role, ...props }: { role: TRole } & any) => {
  const theme = useTheme()

  return (
    <ListItemButton
      {...props}
      style={{
        fontSize: 18,
        outline: 'none',
        userSelect: 'none',
        color: role.color,
        fontWeight: 500,
        backgroundColor: theme.palette.background.paper,
        padding: '10px 0 10px 32px',
        borderTop: '1px solid ' + theme.palette.divider,
        borderBottom: '1px solid ' + theme.palette.divider,
        ...props.style
      }}
    >
      {role.name}
      <Edit style={{ marginLeft: 'auto', marginRight: 16 }} />
    </ListItemButton>
  )
}

export const ProjectSettings = ({ project }: Props) => {
  const [hasClicked, setClicked] = useState(false)
  const navigate = useHistory()
  const dispatch = useAppDispatch()

  const theme = useTheme()

  const roles = useDroppable({ id: 'roles' })

  const sensors = useSensors(
    useSensor(MyPointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor)
  )

  const [editingRole, setEditingRole] = useState<null | TRole>(null)
  const [creatingRole, setCreatingRole] = useState<null | TRole>(null)

  const [dragging, setDragging] = useState<null | TRole>(null)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16
      }}
    >
      <div style={{ marginLeft: 'auto' }}>
        <IconButton
          style={{ position: 'absolute', left: 20 }}
          onClick={() => setCreatingRole({ ...defaultRole, id: nanoid() })}
        >
          <Add />
        </IconButton>
      </div>
      <Typography
        style={{
          fontSize: 24,
          color: theme.palette.text.primary,
          paddingLeft: 80
        }}
      >
        Roles
      </Typography>
      <DndContext
        sensors={sensors}
        onDragStart={(e) => {
          setDragging(project.roles.find((role) => role.id === e.active.id)!)
        }}
        onDragEnd={(e) => {
          moveRole(
            dispatch,
            project,
            project.roles.findIndex((role) => role.id === e.active.id),
            project.roles.findIndex((role) => role.id === e.over?.id)
          )
          setDragging(null)
        }}
      >
        <SortableContext
          id="roles"
          items={project.roles.map((role) => role.id)}
          strategy={verticalListSortingStrategy}
        >
          <List
            ref={roles.setNodeRef}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {project.roles.map((role, i) => (
              <Draggable id={role.id} key={role.id}>
                <RoleItem
                  role={role}
                  disableRipple
                  onClick={() => setEditingRole(cloneDeep(role))}
                  style={{
                    backgroundColor: dragging
                      ? new Color(theme.palette.background.paper)
                          .lighten(0.1)
                          .toString()
                      : theme.palette.background.paper,
                    opacity: dragging && dragging.id === role.id ? 0.8 : 1
                  }}
                />
              </Draggable>
            ))}
          </List>
          <DragOverlay>{dragging && <RoleItem role={dragging} />}</DragOverlay>
        </SortableContext>
      </DndContext>
      <Typography style={{ fontSize: 20, textAlign: 'center', marginTop: 40 }}>
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
              deleteProject(dispatch, navigate.push, project.id)
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
      {editingRole && (
        <RoleBase
          project={project}
          role={editingRole!}
          actionText="Edit Role"
          setRole={setEditingRole}
          deleteFunc={() => {
            setRole(dispatch, editingRole.id, project.id)
            setEditingRole(null)
          }}
          save={() => {
            setRole(dispatch, editingRole!, project.id)
            setEditingRole(null)
          }}
        />
      )}
      {creatingRole && (
        <RoleBase
          project={project}
          role={creatingRole}
          actionText="Create Role"
          setRole={setCreatingRole}
          save={() => {
            setRole(dispatch, creatingRole!, project.id)
            setCreatingRole(null)
          }}
        />
      )}
    </div>
  )
}
