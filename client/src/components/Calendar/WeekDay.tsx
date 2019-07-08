import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { TTasks, TTask } from '../../types/task'
import { getDate, getDay } from 'date-fns'
import { BaseTask } from '../Task/Base'
import { TaskModal } from '../TaskModal/TaskModal'
import { Theme, WithStyles, withStyles } from '@material-ui/core'
import { flatten } from 'lodash'
import {
  getAllTasks,
  getAllTasksArr,
  getProjectIdFromTaskId,
  getAllColumnsArr
} from '../../utils/utilities'

type OwnProps = {
  day: Date
  index: 0 | 1 | 2 | 3 | 4 | 5 | 6
  filteringProjects: string[]
}

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const styles = (theme: Theme) => ({})

type TProps = OwnProps & ReturnType<typeof mapState> & WithStyles<typeof styles>

const CWeekDay = (props: TProps) => {
  const [open, setOpen] = useState(false as false | TTask)
  const { day, tasks, index } = props
  // const hasPassed = index === 0
  const withDate = Object.values(tasks).filter(
    task => task.dueDate !== undefined && getDate(task.dueDate) === getDate(day)
  )
  withDate.sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())

  return (
    <div
      style={{
        borderRight: index !== 6 ? '1px solid #e0e0e0' : undefined,
        flex: '1 0 calc(1200px / 7)'
      }}
    >
      <Droppable
        isDropDisabled={/* hasPassed */ false}
        droppableId={day.getTime().toString()}
      >
        {(provided, snapshot) => (
          <div
            style={{
              backgroundColor: snapshot.isDraggingOver ? '#bae3ff' : 'white',
              transition: 'background-color .2s ease',
              height: '100%'
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div
              style={{
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
            {withDate.map((task, i) => (
              <Draggable
                key={task.id}
                index={i}
                draggableId={task.id.toString()}
              >
                {(prov, snap) => (
                  <BaseTask
                    project={
                      props.projects[
                        getProjectIdFromTaskId(props.projects, task.id)
                      ]
                    }
                    margined
                    dense
                    openFunc={() => setOpen(task)}
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
      {open && (
        <TaskModal
          projectId={getProjectIdFromTaskId(props.projects, open.id)}
          task={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

const getTasks = (state: TState, filteringIds: string[]): TTasks => {
  if (filteringIds.includes('-1') || filteringIds.length === 0) {
    // we dont want to filter anything
    return getAllTasks(state.projects)
  }

  let result: TTasks = {}

  const columnIds = flatten(
    Object.values(state.projects)
      .filter(project => filteringIds.includes(project.id))
      .map(project => project.columnOrder)
  )

  getAllColumnsArr(state.projects).map(column => {
    if (columnIds.includes(column.id)) {
      const columnTasks = getAllTasksArr(state.projects).filter(task =>
        column.taskIds.includes(task.id)
      )
      columnTasks.map(columnTask => {
        result = { ...result, [columnTask.id]: columnTask }
      })
    }
  })

  return result
}

const mapState = (state: TState, ownProps: OwnProps) => ({
  tasks: getTasks(state, ownProps.filteringProjects),
  projects: state.projects
})

export const WeekDay = withStyles(styles)(connect(mapState)(CWeekDay))
