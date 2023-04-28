import {
  Button,
  ButtonBase,
  Fab,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import { colors } from '../colors'
import { getAllTasks, getProjectIdFromTaskId, id } from '../utils/utilities'
import { BaseTask } from './Task/Base'
import { EditTaskModal } from './Task/Edit'
import { Link } from 'react-router-dom'
import Add from '@mui/icons-material/Add'
import { useAppSelector } from '../store/hooks'
import { selectProjects } from '../store/projects'
import { format, getHours } from 'date-fns'
import Color from 'color'

const genColors = () => {
  return Object.values({ ...colors }).map((c) =>
    new Color(c).lightness(12).toString()
  )
}

export const Dashboard = () => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const projects = useAppSelector(selectProjects)
  const user = useAppSelector((state) => state.user)
  const tasks = getAllTasks(projects)
  let betterColors = genColors()

  const theme = useTheme()

  const hours = getHours(new Date())

  const dateDisplay =
    hours < 5 || hours >= 17 ? 'Evening' : hours >= 12 ? 'Afternoon' : 'Morning'

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        minHeight: 'calc(100vh - 58.5px)'
      }}
    >
      <div
        style={{
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="h1"
          style={{ color: theme.palette.text.secondary }}
        >
          {format(new Date(), 'h:mm a')}
        </Typography>
        <Typography variant="h3" style={{ color: theme.palette.text.primary }}>
          Good {dateDisplay}, {user!.username.split(' ')[0]}
        </Typography>
      </div>
      {projects.length ? (
        <div
          style={{
            display: 'flex',
            marginLeft: 24,
            marginTop: 16,
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              style={{ fontWeight: 600, color: theme.palette.text.secondary }}
            >
              Your Tasks
            </Typography>

            {tasks.map((task, i) => (
              <BaseTask
                key={task.id}
                style={{}}
                project={
                  projects[
                    id(projects, getProjectIdFromTaskId(projects, task.id))
                  ]
                }
                openFunc={() => setEditingTaskId(task.id)}
                task={task}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                fontWeight: 600,
                textAlign: 'center',
                color: theme.palette.text.secondary
              }}
            >
              Projects
            </Typography>
            <div style={{ margin: '0px 40px' }}>
              {projects.map((project, i) => {
                const cols: [number, string][] = [
                  [project.tasks.length, 'Tasks'],
                  [0, 'Created'],
                  [0, 'Started'],
                  [0, 'Completed']
                ]
                project.lists.forEach((list) => {
                  list.taskIds.forEach((ids, i) => {
                    cols[i + 1][0] += ids.length
                  })
                })

                const color = betterColors.splice(i, 1)[0]
                if (!betterColors.length) {
                  betterColors = genColors()
                }

                return (
                  <ButtonBase
                    component={Link}
                    to={`/project/${project.id}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 16,
                      borderRadius: 4,
                      marginBottom: 16,
                      minWidth: 300,
                      backgroundColor: color
                    }}
                    key={project.id}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ color: theme.palette.text.primary }}
                    >
                      {project.name}
                    </Typography>
                    <ul
                      style={{
                        color: theme.palette.text.secondary,
                        fontSize: 15
                      }}
                    >
                      {cols.map((col, i) => (
                        <div key={i}>
                          <span
                            style={{
                              fontWeight: 500,
                              fontSize: 17,
                              marginRight: 4,
                              color: theme.palette.text.primary
                            }}
                          >
                            {col[0]}
                          </span>{' '}
                          {col[1]}
                        </div>
                      ))}
                    </ul>
                  </ButtonBase>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}
        >
          <Button
            component={Link}
            variant="contained"
            style={{ width: 240, height: 72, fontSize: 22 }}
            to="/create-project"
          >
            Create Project
          </Button>
        </div>
      )}
      {editingTaskId && (
        <EditTaskModal
          taskId={editingTaskId}
          onClose={() => setEditingTaskId('')}
          projectId={getProjectIdFromTaskId(projects, editingTaskId)}
        />
      )}

      <Tooltip placement="left" title="Create Project">
        <Fab
          component={Link}
          to="/create-project"
          color="primary"
          style={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <Add />
        </Fab>
      </Tooltip>
    </div>
  )
}
