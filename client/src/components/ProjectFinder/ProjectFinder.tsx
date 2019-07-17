import React, { useState } from 'react'
import { TState } from '../../types/state'
import { Button, Dialog, ListItemText, ButtonBase } from '@material-ui/core'
import { connect } from 'react-redux'
import { Add, Edit } from '@material-ui/icons'
import { CreateProject } from '../createProject/CreateProject'
import { NoMatch } from '../NoMatch/NoMatch'
import { Link } from 'react-router-dom'

type OwnProps = {
  mini: boolean
}

type TProps = OwnProps & ReturnType<typeof mapState>

const mapState = (state: TState) => ({
  user: state.user!,
  projects: state.projects
})

export const ProjectFinder = connect(mapState)((props: TProps) => {
  const [manageMode, setManageMode] = useState(false) // when in manage mode project cards will be different
  const [creating, setCreating] = useState(false)

  return props.user ? (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: 'flex',
          maxWidth: 1500,
          margin: '0px auto'
        }}
      >
        <Button
          style={{ marginLeft: 'auto' }}
          variant="contained"
          color="secondary"
          onClick={() => setCreating(true)}
        >
          <Add style={{ marginRight: 8 }} />
          Create Project
        </Button>
        <Button
          variant="outlined"
          style={{ marginLeft: 8 }}
          onClick={() => setManageMode(!manageMode)}
        >
          <Edit style={{ marginRight: 8 }} />
          Manage
        </Button>
      </div>
      {props.projects.map(project => (
        <ButtonBase component={Link} to={`/project/${project.id}`}>
          <ListItemText primary={project.name} />
        </ButtonBase>
      ))}

      {creating && (
        <Dialog open={creating} onClose={() => setCreating(false)}>
          <CreateProject />
        </Dialog>
      )}
    </div>
  ) : (
    <NoMatch />
  )
})
