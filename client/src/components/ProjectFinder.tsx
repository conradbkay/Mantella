import { useState } from 'react'
import {
  TextField,
  List,
  ListSubheader,
  ListItemText,
  Button,
  Typography,
  ListItemButton
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import { useGetProjectsQuery } from '../store/api'

interface TProps {
  variant?: 'menu'
  noButton?: true
  onClick?(): void
}

export const ProjectFinder = (props: TProps) => {
  const [search, setSearch] = useState('')
  const { data: projects } = useGetProjectsQuery()

  if (!projects) {
    return null
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        marginLeft: 'auto',
        marginRight: 'auto',
        minWidth: 280
      }}
    >
      {props.variant !== 'menu' && (
        <Typography align="center" style={{ marginBottom: 10 }} variant="h4">
          Projects
        </Typography>
      )}
      <TextField
        autoFocus={props.variant === 'menu' ? true : undefined}
        style={{ borderRadius: '0%' }}
        fullWidth
        label="Filter by Name or Category"
        variant={props.variant === 'menu' ? ('standard' as any) : 'outlined'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <List
        sx={{
          margin: '25px auto 0px auto',
          borderRadius: 0,
          width: '100%'
        }}
        subheader={
          <ListSubheader
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              fontSize: 16,
              marginTop: 8
            }}
            component="div"
          >
            Projects
          </ListSubheader>
        }
      >
        {projects.map((project) => {
          const isLink = project.id === ('create-project' as any)
          const urlPrefix = isLink ? '' : '/project/'
          return (
            <div key={project.id} style={{ whiteSpace: 'nowrap' }}>
              <ListItemButton
                disabled={
                  window.location.pathname.split('/project/')[1] === project.id
                }
                to={urlPrefix + project.id.toString()}
                onClick={props.onClick}
                component={Link}
              >
                <ListItemText primary={project.name} />
              </ListItemButton>
            </div>
          )
        })}
      </List>
      <div style={{ marginTop: 20 }}>
        {!props.noButton && (
          <Button
            variant="outlined"
            color="primary"
            to="/create-project"
            component={Link}
            fullWidth
          >
            Create Project
          </Button>
        )}
      </div>
    </div>
  )
}
