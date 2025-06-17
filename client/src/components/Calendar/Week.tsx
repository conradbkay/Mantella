import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { subDays, addDays } from 'date-fns'
import { WeekDay } from './WeekDay'
import { WeekControls } from './WeekControls'
import { TTask, TProject } from '../../types/project'
import { useGetProjectsQuery } from '../../store/api'

/** Gets the day behind the passed date, the passed date, and the 5 dates after passed date */
const getDays = (start: Date): Date[] => {
  const result: Date[] = [subDays(start, -1), start]
  for (let i = 0; i < 5; i++) {
    result.push(addDays(start, i + 1))
  }

  return result
}

type Props = {
  project?: TProject
}

// its fine that completed tasks are shown because it's close to the day they are viewing
export const CalendarWeek = ({ project }: Props) => {
  const [filterProjectId, setFilterProjectId] = useState(['-1'])
  const [baseDay, setBaseDay] = useState(new Date())

  const { data: projects } = useGetProjectsQuery()

  if (!projects) {
    return null
  }

  let allTasks = project
    ? project.tasks
    : projects.reduce((tasks: TTask[], project: TProject) => {
        return [...tasks, ...project.tasks]
      }, [] as TTask[])

  allTasks = allTasks.filter((task: TTask) => task.dueDate)

  const days = getDays(baseDay)

  // using new Array(7).fill([]) causes all references to be to the same array
  const weekTasks: TTask[][] = [[], [], [], [], [], [], []]

  for (let task of allTasks) {
    const taskDay = days
      .map((day) => day.getMonth() + '|' + day.getDate())
      .indexOf(
        new Date(task.dueDate!).getMonth() +
          '|' +
          new Date(task.dueDate!).getDate()
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
      <div>
        <WeekControls
          startDay={days[0]}
          currIds={filterProjectId}
          projects={projects}
          toggleProject={(projId: string[]) => {
            setFilterProjectId(projId)
          }}
          setDate={(newDay: Date) => setBaseDay(newDay)}
        />
        {!allTasks.length ? (
          <Typography
            variant="h4"
            color="text.secondary"
            style={{ margin: '12px auto', textAlign: 'center' }}
          >
            You have no tasks with due dates
          </Typography>
        ) : null}
        <Box
          sx={{
            border: '1px solid #dadce0',
            borderRadius: '.8rem',
            overflowX: 'hidden',
            marginTop: 4
          }}
        >
          <Box
            sx={{
              minHeight: 200,
              overflowX: 'auto',
              display: 'flex',
              flex: '1 1 auto',
              overflowY: 'hidden'
            }}
          >
            {days.map((day, i) => (
              <WeekDay
                tasks={weekTasks[i]}
                filteringProjects={filterProjectId}
                day={day}
                key={i}
                index={i as any}
              />
            ))}
          </Box>
        </Box>
      </div>
    </>
  )
}
