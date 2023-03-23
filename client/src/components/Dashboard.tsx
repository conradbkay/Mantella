import {
  Button,
  Card,
  CardActions,
  Fab,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { CSSProperties, useState } from 'react'
import { connect } from 'react-redux'
import { colors } from '../colors'
import { TState } from '../types/state'
import { getAllTasks, getProjectIdFromTaskId, id } from '../utils/utilities'
import { BaseTask } from './Task/Base'
import { EditTaskModal } from './Task/Edit'
import { Link } from 'react-router-dom'
import Add from '@mui/icons-material/Add'

const root: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  padding: '12px 24px'
}

const mapState = (state: TState) => ({
  projects: state.projects
})

const genColors = () => {
  let betterColors: any = { ...colors }
  delete betterColors.Default
  delete betterColors.Brown
  delete betterColors.Black
  delete betterColors.Yellow
  return Object.values(betterColors)
}

export const Dashboard = connect(mapState)(
  (props: ReturnType<typeof mapState>) => {
    const [editingTaskId, setEditingTaskId] = useState('')
    //const [tasks, setTasks] = useState(getAllTasks(props.projects))
    const tasks = getAllTasks(props.projects)
    let betterColors = genColors()

    const theme = useTheme()

    return (
      <div style={{ ...root, backgroundColor: theme.palette.background.paper }}>
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
                props.projects[
                  id(
                    props.projects,
                    getProjectIdFromTaskId(props.projects, task.id)
                  )
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
            {props.projects.map((project, i) => {
              const cols = [0, 0, 0]
              project.lists.forEach((list) => {
                list.taskIds.forEach((ids, i) => {
                  cols[i] += ids.length
                })
              })

              console.log(betterColors)
              const color = betterColors.splice(i, 1)[0]
              if (!betterColors.length) {
                betterColors = genColors()
              }
              console.log(color)

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
                    <Button component={Link} to={`/project/${project.id}`}>
                      View
                    </Button>
                  </CardActions>
                </Card>
              )
            })}
          </div>
        </div>
        {editingTaskId && (
          <EditTaskModal
            taskId={editingTaskId}
            onClose={() => setEditingTaskId('')}
            projectId={getProjectIdFromTaskId(props.projects, editingTaskId)}
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
)