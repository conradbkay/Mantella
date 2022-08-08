import {
  withStyles,
  WithStyles,
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper
} from '@material-ui/core'
import { formStyles } from '../styles/formStyles'
import { CalendarTodayRounded } from '@material-ui/icons'
import { connect } from 'react-redux'
import { Change } from '../../types/types'
import { TState } from '../../types/state'
import { useState } from 'react'
import { openSnackbarA } from '../../store/actions/snackbar'
import { setProjectA } from '../../store/actions/project'
import Helmet from 'react-helmet'
import { APICreateProject } from '../../API/project'

type CreateProjectProps = WithStyles<typeof formStyles> &
  typeof actionCreators &
  ReturnType<typeof mapState>

const CCreateProject = (props: CreateProjectProps) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const onCompleted = async () => {
    setLoading(true)
    const res = await APICreateProject(name || 'Untitled Project')
    if (res && res.id) {
      props.setProject({
        id: res.id,
        newProj: res
      })

      window.location.hash = '#/project/' + res.id
      props.openSnackbar('Project Created Successfully', 'success')
    } else {
      props.openSnackbar('Project Could Not Be Created', 'warning')
    }
    setLoading(false)
  }

  const { classes } = props

  return (
    <>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
      </Helmet>
      <main
        style={{ margin: 'auto', marginTop: 64 }}
        className={classes.layout}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (props.user) {
              onCompleted()
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
            {loading && <CircularProgress style={{ margin: '4px auto' }} />}
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
  openSnackbar: openSnackbarA,
  setProject: setProjectA
}

export const CreateProject = connect(
  mapState,
  actionCreators
)(withStyles(formStyles)(CCreateProject))
