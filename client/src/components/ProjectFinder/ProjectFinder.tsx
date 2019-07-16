import React, { useState } from 'react'
import { TState } from '../../types/state'
import { Button, Dialog, ButtonBase } from '@material-ui/core'
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
  const [secret, setSecret] = useState(false)
  const [creating, setCreating] = useState(false)

  return props.user ? (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          maxWidth: 1500,
          margin: '0px auto'
        }}
      >
        <p
          onMouseEnter={() => setSecret(true)}
          style={{
            fontSize: 22,
            backgroundClip: secret ? 'text' : undefined,
            backgroundImage: secret
              ? 'repeating-linear-gradient(45deg, violet, indigo, blue, green, orange, red, violet)' // 'linear-gradient(to-left, violet, indigo, blue, green, yellow, orange, red)'
              : undefined,
            color: secret ? 'transparent' : undefined,
            WebkitTextFillColor: secret ? 'transparent' : undefined,
            WebkitBackgroundClip: secret ? 'text' : undefined
          }}
        >
          👋 Hello <strong>{props.user.username.split(' ')[0]}</strong> I
          {secret ? ' absolutely do not' : ''} believe in you
        </p>

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
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {props.projects.map(project => (
          <ButtonBase
            component={Link}
            to={`/project/${project.id}`}
            style={{
              padding: '16px',
              borderRadius: 4,
              margin: 16,
              border: '1px solid #969696'
            }}
          >
            {project.name}
          </ButtonBase>
        ))}
      </div>

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
