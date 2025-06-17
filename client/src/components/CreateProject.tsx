import {
  Avatar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Box
} from '@mui/material'
import {
  formStyleAvatar,
  formStyleLayout,
  formStylePaper
} from './styles/formStyles'
import CalendarTodayRounded from '@mui/icons-material/CalendarTodayRounded'
import { useState } from 'react'
import Helmet from 'react-helmet'
import { useNavigate } from '@tanstack/react-router'
import { useCreateProjectAction } from '../actions/project'

export const CreateProject = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const createProjectAction = useCreateProjectAction()

  const onCompleted = async () => {
    setLoading(true)
    await createProjectAction(name, navigate)
    setLoading(false)
  }

  return (
    <>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
      </Helmet>
      <Box
        component="main"
        sx={{ ...formStyleLayout, margin: 'auto', marginTop: 10 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()

            onCompleted()
          }}
        >
          <Paper sx={formStylePaper}>
            <Avatar sx={formStyleAvatar}>
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
                onChange={(e) => setName(e.target.value)}
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
      </Box>
    </>
  )
}
