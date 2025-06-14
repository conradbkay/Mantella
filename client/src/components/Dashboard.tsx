import {
  Button,
  ButtonBase,
  Fab,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import { colors, colorForLightMode, transformDefault } from '../utils/color'
import { getAllTasks, getProjectIdFromTaskId, id } from '../utils/utils'
import { BaseTask } from './Task/Base'
import { EditTaskModal } from './Task/Edit'
import { Link } from 'react-router-dom'
import Add from '@mui/icons-material/Add'
import { useAppSelector } from '../store/hooks'
import { selectProjects } from '../store/projects'
import { format, getHours } from 'date-fns'
import useTitle from './useTitle'

const genColors = (theme: any) => {
  return Object.values({ ...colors }).map((c) => {
    const backgroundColor =
      theme.palette.mode === 'dark' ? c : colorForLightMode(c)
    return transformDefault(backgroundColor, theme.palette.mode)
  })
}

export const Dashboard = () => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const projects = useAppSelector(selectProjects)
  const user = useAppSelector((state) => state.user)
  const tasks = getAllTasks(projects)
  const theme = useTheme()
  let betterColors = genColors(theme)

  const hours = getHours(new Date())

  useTitle('Dashboard')

  const dateDisplay =
    hours < 5 || hours >= 17 ? 'Evening' : hours >= 12 ? 'Afternoon' : 'Morning'

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        minHeight: 'calc(100vh - 58.5px)',
        padding: '12px 24px'
      }}
    >
      <div
        style={{
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          marginBottom: 24
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
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32
          }}
        >
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                overflowX: 'auto',
                paddingBottom: 16
              }}
            >
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
                  betterColors = genColors(theme)
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
                      marginRight: 16,
                      minWidth: 300,
                      border: `1px solid ${color}`
                    }}
                    key={project.id}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      style={{ color: color, fontFamily: 'Viga' }}
                    >
                      {project.name}
                    </Typography>
                    <ul>
                      {cols.map((col, i) => (
                        <div key={i}>
                          <Typography
                            display="inline-flex"
                            style={{
                              fontWeight: 500,
                              fontSize: 22
                            }}
                            color="text.secondary"
                          >
                            <span
                              style={{
                                minWidth: '30px',
                                color: color,
                                fontFamily: 'Viga'
                              }}
                            >
                              {col[0]}
                            </span>{' '}
                            <span
                              style={{
                                fontSize: 14,
                                margin: 'auto 8px'
                              }}
                            >
                              {col[1]}
                            </span>
                          </Typography>
                        </div>
                      ))}
                    </ul>
                  </ButtonBase>
                )
              })}
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: 800 }}>
            <Typography
              variant="h5"
              gutterBottom
              style={{
                fontWeight: 600,
                color: theme.palette.text.secondary,
                textAlign: 'center',
                marginBottom: 16
              }}
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
