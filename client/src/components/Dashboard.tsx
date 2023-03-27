import {
  Button,
  Card,
  CardActions,
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

const genColors = () => {
  let betterColors: any = { ...colors }
  delete betterColors.Default
  delete betterColors.Brown
  delete betterColors.Black
  delete betterColors.Yellow
  return Object.values(betterColors)
}

export const Dashboard = () => {
  const [editingTaskId, setEditingTaskId] = useState('')
  const projects = useAppSelector(selectProjects)
  const user = useAppSelector((state) => state.user)
  //const [tasks, setTasks] = useState(getAllTasks(props.projects))
  const tasks = getAllTasks(projects)
  let betterColors = genColors()

  const theme = useTheme()

  const hours = getHours(new Date())

  const dateDisplay =
    hours < 5 || hours >= 17 ? 'Evening' : hours >= 12 ? 'Afternoon' : 'Morning'

  return (
    <div style={{ backgroundColor: theme.palette.background.paper }}>
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
      <div style={{ display: 'flex', marginLeft: 24, marginTop: 16 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
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
              const cols = [0, 0, 0]
              project.lists.forEach((list) => {
                list.taskIds.forEach((ids, i) => {
                  cols[i] += ids.length
                })
              })

              const color = betterColors.splice(i, 1)[0]
              if (!betterColors.length) {
                betterColors = genColors()
              }

              return (
                <Card
                  style={{
                    padding: 16,
                    paddingBottom: 0,
                    margin: '12px 0',
                    minWidth: 300,
                    backgroundColor: color as any
                  }}
                  key={project.id}
                >
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ color: theme.palette.text.secondary }}
                  >
                    {project.name}
                  </Typography>
                  <ul style={{ color: theme.palette.text.secondary }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>
                        {project.tasks.length}
                      </span>{' '}
                      Tasks
                    </div>
                    <div>
                      <span style={{ fontWeight: 500 }}>{cols[0]}</span> Created
                    </div>
                    <div>
                      <span style={{ fontWeight: 500 }}>{cols[1]}</span> Started
                    </div>
                    <div>
                      <span style={{ fontWeight: 500 }}>{cols[2]}</span>{' '}
                      Finished
                    </div>
                  </ul>
                  <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button
                      component={Link}
                      to={`/project/${project.id}`}
                      style={{
                        color: theme.palette.text.primary,
                        marginRight: -12
                      }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
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
