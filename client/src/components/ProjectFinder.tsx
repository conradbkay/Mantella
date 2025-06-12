import { useState } from 'react'
import {
  TextField,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Button,
  Typography
} from '@mui/material'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { formalize } from '../utils/utils'
import { makeStyles } from '@mui/styles'
import { useAppSelector } from '../store/hooks'
import { selectProjects } from '../store/projects'

const useStyles = makeStyles(() => ({
  list: {
    margin: '25px auto 0px auto',
    borderRadius: 0,
    width: '100%'
  }
}))

interface TProps extends RouteComponentProps {
  variant?: 'menu'
  noButton?: true
  onClick?(): void
}

export const ProjectFinder = withRouter((props: TProps) => {
  const [search, setSearch] = useState('')
  const rawProjects = useAppSelector(selectProjects)
  const classes = useStyles()

  let projects = [...Object.values(rawProjects)]

  projects = projects.filter((project) => {
    const myString: string = formalize(project.name)
    const searchInput = formalize(search)

    return myString.indexOf(searchInput) > -1
  })

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
        className={classes.list}
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
        {projects.map((project, i) => {
          const isLink = project.id === ('create-project' as any)
          const urlPrefix = isLink ? '' : '/project/'
          return (
            <div key={project.id} style={{ whiteSpace: 'nowrap' }}>
              <ListItem
                button
                disabled={
                  props.location.pathname.split('/project/')[1] === project.id
                }
                to={urlPrefix + project.id.toString()}
                onClick={props.onClick}
                component={Link}
              >
                <ListItemText primary={project.name} />
              </ListItem>
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
})
