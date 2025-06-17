import {
  Button,
  Typography,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  TextField,
  Box
} from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import { useState, useEffect } from 'react'
import { TProject } from '../../types/project'
import { useDeleteProjectAction } from '../../actions/project'
import { useEditProjectMutation } from '../../store/api'

type Props = {
  project: TProject
}

export const ProjectSettings = ({ project }: Props) => {
  const [hasClicked, setClicked] = useState(false)
  const [projectName, setProjectName] = useState(project.name)
  const [isEditingName, setIsEditingName] = useState(false)

  const deleteProject = useDeleteProjectAction()
  const [editProject] = useEditProjectMutation()
  const theme = useTheme()

  // Sync projectName state with project prop
  useEffect(() => {
    setProjectName(project.name)
  }, [project.name])

  const handleSaveProjectName = async () => {
    if (projectName.trim() && projectName !== project.name) {
      await editProject({
        id: project.id,
        newProj: { name: projectName.trim() }
      }).unwrap()
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setProjectName(project.name)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 16
      }}
    >
      <ListItem
        style={{
          color: theme.palette.text.secondary,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ListItemAvatar>
          <Edit />
        </ListItemAvatar>
        <Box style={{ width: '100%' }}>
          {isEditingName ? (
            <Box style={{ display: 'flex' }}>
              <TextField
                size="small"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveProjectName()
                  } else if (e.key === 'Escape') {
                    handleCancelEdit()
                  }
                }}
                autoFocus
                fullWidth
              />
              <Button
                size="small"
                onClick={handleSaveProjectName}
                color="primary"
                variant="contained"
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Box>
          ) : (
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ flexGrow: 1, fontSize: 18 }}>
                {project.name}
              </Typography>
              <Button
                size="small"
                onClick={() => setIsEditingName(true)}
                color="primary"
                variant="outlined"
              >
                Edit
              </Button>
            </Box>
          )}
        </Box>
      </ListItem>
      <ListItem sx={{ mt: 1, color: 'text.secondary' }}>
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
              deleteProject(project.id)
            } else {
              setClicked(true)
            }
          }}
          variant={hasClicked ? 'contained' : 'outlined'}
          style={{ maxHeight: 36, margin: 'auto' }}
          color="error"
        >
          {hasClicked ? 'Confirm' : 'Delete'}
        </Button>
      </ListItem>
    </div>
  )
}
