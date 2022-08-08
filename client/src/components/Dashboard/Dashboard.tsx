import {
  Button,
  Card,
  CardActions,
  Fab,
  Tooltip,
  Typography
} from '@material-ui/core'
import { CSSProperties, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { colors } from '../../colors'
import { TState } from '../../types/state'
import {
  getAllTasks,
  getProjectIdFromTaskId,
  id,
  moveInArray
} from '../../utils/utilities'
import { BaseTask } from '../Project/Task/Base'
import { EditTaskModal } from '../Project/Task/Edit/Edit'
import { Link } from 'react-router-dom'
import { Add } from '@material-ui/icons'

const root: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  margin: 40
}

const mapState = (state: TState) => ({
  projects: state.projects
})

const genColors = () => {
  let betterColors: any = { ...colors }
  delete betterColors.White
  delete betterColors.Brown
  delete betterColors.Yellow
  return Object.values(betterColors)
}

export const Dashboard = connect(mapState)(
  (props: ReturnType<typeof mapState>) => {
    const [editingTaskId, setEditingTaskId] = useState('')
    const [tasks, setTasks] = useState(getAllTasks(props.projects))

    const onDragEnd = (result: DropResult) => {
      const { source, destination } = result

      if (destination) {
        setTasks(moveInArray(tasks, source.index, destination.index))
      }
    }

    let betterColors = genColors()

    return (
      <div style={root}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }}>
            Your Tasks
          </Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable isDropDisabled={true} droppableId="dashboard">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, i) => (
                    <Draggable
                      key={task.id}
                      index={i}
                      draggableId={task.id.toString()}
                    >
                      {(prov, snap) => (
                        <BaseTask
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
                          provided={prov}
                          snapshot={snap}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontWeight: 600, textAlign: 'center' }}
          >
            Projects
          </Typography>
          <div style={{ margin: '0px 40px' }}>
            {props.projects.map((project, i) => {
              const cols = [0, 0, 0]
              project.tasks.forEach((task) => {
                cols[task.progress]++
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
                  <Typography gutterBottom variant="h5" component="h2">
                    {project.name}
                  </Typography>
                  <ul>
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
