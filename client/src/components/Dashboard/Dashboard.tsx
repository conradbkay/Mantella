import { Card, Typography } from '@material-ui/core'
import React, { CSSProperties, useState } from 'react'
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
import { EditTaskModal } from '../Project/Task/Edit'

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
        setTasks(
          moveInArray(tasks, source.index, destination.index - source.index)
        )
      }
    }

    let betterColors = genColors()

    return (
      <div style={root}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard">
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
        <div style={{ margin: 40 }}>
          {props.projects.map((project, i) => {
            const cols = [0, 0, 0]
            project.tasks.map((task) => {
              cols[task.progress]++
            })

            const color = betterColors.splice(
              Math.floor(Math.random() * betterColors.length),
              1
            )[0]
            if (!betterColors.length) {
              betterColors = genColors()
            }

            return (
              <Card
                style={{
                  padding: 16,
                  margin: '12px 0',
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
                    <span style={{ fontWeight: 500 }}>{cols[2]}</span> Finished
                  </div>
                </ul>
              </Card>
            )
          })}
        </div>
        {editingTaskId && (
          <EditTaskModal
            taskId={editingTaskId}
            onClose={() => setEditingTaskId('')}
            projectId={getProjectIdFromTaskId(props.projects, editingTaskId)}
          />
        )}
      </div>
    )
  }
)
