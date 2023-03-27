import {
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper
} from '@mui/material'
import { useFormStyles } from './styles/formStyles'
import CalendarTodayRounded from '@mui/icons-material/CalendarTodayRounded'
import { Change } from '../types/types'
import { useState } from 'react'
import Helmet from 'react-helmet'
import { APICreateProject } from '../API/project'
import { useHistory } from 'react-router'
import { SET_PROJECT } from '../store/projects'
import { OPEN_SNACKBAR } from '../store/snackbar'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectUser } from '../store/user'

export const CreateProject = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useHistory()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const onCompleted = async () => {
    setLoading(true)
    const res = await APICreateProject(name || 'Untitled Project')
    if (res && res.id) {
      dispatch(
        SET_PROJECT({
          id: res.id,
          project: res
        })
      )

      navigate.push('/project/' + res.id)
      dispatch(
        OPEN_SNACKBAR({
          message: 'Project Created Successfully',
          variant: 'success'
        })
      )
    } else {
      dispatch(
        OPEN_SNACKBAR({
          message: 'Project Could Not Be Created',
          variant: 'warning'
        })
      )
    }
    setLoading(false)
  }

  const classes = useFormStyles()

  return (
    <>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
      </Helmet>
      <main
        style={{ margin: 'auto', marginTop: 80 }}
        className={classes.layout}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (user) {
              onCompleted()
            } else {
              dispatch(
                OPEN_SNACKBAR({
                  message: "You havn't logged in, silly goose",
                  variant: 'warning'
                })
              )
            }
          }}
        >
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <CalendarTodayRounded />
            </Avatar>
            <Typography style={{ fontSize: 19 }}>Create Project</Typography>
            {loading && <CircularProgress style={{ margin: '4px auto' }} />}
            <div style={{ display: 'flex', width: '100%', marginTop: 8 }}>
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
