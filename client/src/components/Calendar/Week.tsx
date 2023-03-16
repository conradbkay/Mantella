import { useState } from 'react'
import { Theme } from '@mui/material'
import { setTaskA } from '../../store/actions/task'
import { connect } from 'react-redux'
import { TState } from '../../types/state'
import { subDays, addDays } from 'date-fns'
import { WeekDay } from './WeekDay'
import { WeekControls } from './WeekControls'
import { makeStyles } from '@mui/styles'
import { TTask } from '../../types/project'

type ActionCreators = typeof actionCreators

interface TProps extends ReturnType<typeof mapState>, ActionCreators {}

/** Gets the day behind the passed date, the passed date, and the 5 dates after passed date */
const getDays = (start: Date): Date[] => {
  const result: Date[] = [subDays(start, 1), start]
  for (let i = 0; i < 5; i++) {
    result.push(addDays(start, i + 1)) // start at adding 1 day
  }

  return result
}

const useStyles = makeStyles((theme: Theme) => ({
  dragContainer: {
    border: '1px solid #dadce0',
    borderRadius: '.8rem',
    overflowX: 'hidden',
    marginTop: 10
  },
  tasksContainer: {
    minHeight: 200,
    overflowX: 'auto',
    display: 'flex',
    flex: '1 1 auto',
    overflowY: 'hidden'
  }
}))

const CWeek = (props: TProps) => {
  const [filterProjectId, setFilterProjectId] = useState(['-1'])
  const [baseDay, setBaseDay] = useState(new Date())

  const allTasks = props.projects.reduce((tasks, project) => {
    return [...tasks, ...project.tasks]
  }, [])

  const weekEmpty = allTasks.filter((task) => task.dueDate).length

  const classes = useStyles()

  const days = getDays(baseDay)

  const weekTasks: TTask[][] = new Array(7).fill([])

  for (let task of allTasks) {
    if (!task.dueDate) continue

    const taskDay = days
      .map((day) => day.getMonth() + '|' + day.getDate())
      .indexOf(
        new Date(task.dueDate).getMonth() +
          '|' +
          new Date(task.dueDate).getDate()
      )

    if (taskDay === -1) {
      continue
    }

    weekTasks[taskDay].push(task)
  }

  for (let i = 0; i < weekTasks.length; i++) {
    weekTasks[i].sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    })
  }

  return (
    <>
      <div style={{ margin: 20 }}>
        <WeekControls
          startDay={days[0]}
          currIds={filterProjectId}
          projects={props.projects}
          toggleProject={(projId: string[]) => {
            setFilterProjectId(projId)
          }}
          setDate={(newDay: Date) => setBaseDay(newDay)}
        />

        <div className={classes.dragContainer}>
          <div className={classes.tasksContainer}>
            {days.map((day, i) => (
              <WeekDay
                tasks={weekTasks[i]}
                filteringProjects={filterProjectId}
                day={day}
                key={i}
                index={i as any}
              />
            ))}
          </div>
        </div>
      </div>
      {weekEmpty && (
        <h1 style={{ margin: '20px auto', textAlign: 'center' }}>
          You have no tasks with due dates
        </h1>
      )}
    </>
  )
}

const mapState = (state: TState) => ({
  projects: state.projects
})

const actionCreators = {
  setTask: setTaskA
}

export const CalendarWeek = connect(mapState, actionCreators)(CWeek)
