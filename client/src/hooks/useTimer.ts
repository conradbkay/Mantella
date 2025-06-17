import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toDaysHHMMSS } from '../utils/utils'
import { SYNC_TIMER } from '../store/pomodoro'
import { id } from '../utils/utils'
import { TProject, TTask } from '../types/project'
import { TPomodoro } from '../types/state'
import { useEditTaskMutation, useGetProjectsQuery } from '../store/api'

export const getDisplayTimeLeft = (pomodoro: TPomodoro) => {
  return toDaysHHMMSS(Math.ceil((pomodoro.timeLeftMs ?? 0) / 1000)) // if 1100ms passed then timeLeft is 23900. If we ceil this and floor the other it works out
}

// generally we have to maintain pomodoro and task timing separately, since we can switch tasks during the same pomodoro
export const useTimer = () => {
  const dispatch = useAppDispatch()
  const { data: projects } = useGetProjectsQuery()

  const [editTask] = useEditTaskMutation()

  const pomodoro = useAppSelector((state) => state.pomodoro)

  const savedCallback = useRef(() => {})

  useEffect(() => {
    if (!projects) {
      return
    }

    savedCallback.current = () => {
      const now = Date.now()
      const elapsedMs =
        now - (pomodoro.lastTickMs ?? pomodoro.lastStartMs ?? now)

      dispatch(SYNC_TIMER({ elapsedMs, now }))

      document.title = `${
        !pomodoro.isBreak ? 'Work ' : 'Break '
      }${getDisplayTimeLeft(pomodoro)}`

      if (pomodoro.isBreak) return // don't count towards task
      if (!pomodoro.selectedTaskId) return

      const project = projects.find((proj: TProject) =>
        proj.tasks.some((task: TTask) => task.id === pomodoro.selectedTaskId)
      )

      if (!project) {
        console.error('Project not found', pomodoro.selectedTaskId)
        return
      }

      const task = project.tasks[id(project.tasks, pomodoro.selectedTaskId)]

      const newWorkedOnMs = (task.workedOnMs || 0) + elapsedMs
      const oldSeconds = Math.floor((task.workedOnMs || 0) / 1000)
      const newSeconds = Math.floor(newWorkedOnMs / 1000)

      // persist to server every 10 seconds. means task won't appear to update until this though...
      if (Math.floor(newSeconds / 10) > Math.floor(oldSeconds / 10)) {
        editTask({
          taskId: task.id,
          projId: project.id,
          task: { ...task, workedOnMs: newWorkedOnMs }
        })
      }
    }
  }, [pomodoro, projects, dispatch])

  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    if (pomodoro.isPaused) {
      return
    }

    const timerId = setInterval(tick, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [pomodoro.isPaused])
}
