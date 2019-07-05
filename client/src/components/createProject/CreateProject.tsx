import * as React from 'react'

import {
  withStyles,
  Paper,
  WithStyles,
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress
} from '@material-ui/core'
import { formStyles } from '../styles/formStyles'
import { CalendarTodayRounded } from '@material-ui/icons'
import { connect } from 'react-redux'
import { Change } from '../../types/types'
import { TState } from '../../types/state'
import Helmet from 'react-helmet'
import { useState } from 'react'
import { openSnackbarA } from '../../store/actions/snackbar'

type CreateProjectProps = WithStyles<typeof formStyles> &
  typeof actionCreators &
  ReturnType<typeof mapState>

const CCreateProject = (props: CreateProjectProps) => {
  const [name, setName] = useState('')

  /*
  const [createProjectExec, { loading }] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(GQL_CREATE_PROJECT, {
    onCompleted: ({ createProject }) => {
      if (createProject && createProject.id) {
        props.createProject({
          id: createProject.id,
          newProj: resToNiceProject(createProject)
        })

        window.location.hash = '#/project/' + createProject!.id
        props.openSnackbar('Project Created Successfully', 'success')
      } else {
        props.openSnackbar('Project Could Not Be Created', 'warning')
      }
    },
    onError: (error: any) => {
      props.openSnackbar('Error when creating project', 'error')
    }
  })
  */

  const { classes } = props

  return (
    <>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        <meta
          name="description"
          content="Create a project today to jumpstart your time"
        />
      </Helmet>
      <main style={{ margin: 'auto' }} className={classes.layout}>
        <form
          onSubmit={e => {
            e.preventDefault()

            if (props.user) {
              /* createProjectExec({
                variables: {
                  name: name || 'Unnamed Project'
                }
              }) */
            } else {
              props.openSnackbar("You havn't logged in, silly goose", 'warning')
            }
          }}
        >
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <CalendarTodayRounded />
            </Avatar>
            <Typography style={{ fontSize: 17 }}>Create Project</Typography>
            {/* loading */ true && (
              <CircularProgress style={{ margin: '4px auto' }} />
            )}
            <div style={{ display: 'flex', width: '100%' }}>
              <TextField
                autoFocus
                label="Project Name"
                value={name}
                fullWidth
                onChange={(e: Change) => setName(e.target.value)}
                required
              />
              <div style={{ marginLeft: 12, marginTop: 'auto' }}>
                <Button
                  style={{ marginTop: 'auto' }}
                  variant="contained"
                  color="secondary"
                  type="submit"
                >
                  Create
                </Button>
              </div>
            </div>
          </Paper>
        </form>
      </main>
    </>
  )
}

const mapState = (state: TState) => ({
  user: state.user
})
const actionCreators = {
  openSnackbar: openSnackbarA
}

export const CreateProject = connect(
  mapState,
  actionCreators
)(withStyles(formStyles)(CCreateProject))