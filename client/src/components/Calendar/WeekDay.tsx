import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { getDate, getDay, isPast, addHours } from 'date-fns'
import { BaseTask } from '../Project/Task/Base'
import { Theme, WithStyles, withStyles } from '@material-ui/core'
import { getProjectIdFromTaskId, id } from '../../utils/utilities'
import { useState } from 'react'
import { EditTaskModal } from '../Project/Task/Edit/Edit'

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const styles = (theme: Theme) => ({})

interface Props extends ReturnType<typeof mapState>, WithStyles<typeof styles> {
  day: Date
  index: 0 | 1 | 2 | 3 | 4 | 5 | 6
  filteringProjects: string[]
}

const CWeekDay = (props: Props) => {
  const { day, tasks, index } = props
  const hasPassed = isPast(addHours(day, 20))
  const [editingTaskId, setEditingTaskId] = useState('')

  const withDate = tasks.filter(
    (task) =>
      task.dueDate !== undefined &&
      getDate(new Date(task.dueDate!)) === getDate(day)
  )
  if (withDate.length) {
    withDate.sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
  }

  return (
    <div
      style={{
        borderRight: index !== 6 ? '1px solid #e0e0e0' : undefined,
        flex: '1 0 calc(1000px / 7)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          fontSize: '3.2rem',
          fontWeight: 300,
          margin: '0 0 0 .8rem',
          paddingBottom: '.4rem',
          color: sameDay(day, new Date()) ? '#4285f4' : '#555'
        }}
      >
        {day.getDate()}
        <div style={{ fontSize: '1.3rem' }}>{names[getDay(day)]}</div>
      </div>
      <Droppable
        isDropDisabled={hasPassed}
        droppableId={day.getTime().toString()}
      >
        {(provided, snapshot) => (
          <div
            style={{
              backgroundColor: snapshot.isDraggingOver ? '#bae3ff' : 'white',
              transition: 'background-color .2s ease',
              marginTop: 93,
              height: '100%'
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {withDate.map((task, i) => (
              <Draggable
                key={task.id}
                index={i}
                draggableId={task.id.toString()}
              >
                {(prov, snap) => (
                  <BaseTask
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
                    provided={prov}
                    snapshot={snap}
                    task={task}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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

const mapState = (state: TState) => ({
  tasks: state.projects.reduce((accum, proj) => {
    return [...accum, ...proj.tasks]
  }, []),
  projects: state.projects
})

export const WeekDay = withStyles(styles)(connect(mapState)(CWeekDay))
